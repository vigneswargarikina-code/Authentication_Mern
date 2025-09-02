import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../Models/userModel.js';
import transporter from '../config/nodeMailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Service",
      text: `Hello ${name},\n\nThank you for registering!`
    };

    // Send mail
    await transporter.sendMail(mailOptions);

    // Send cookie + response
    res.status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({ success: true, message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({ success: true, message: "User logged in successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    res.status(200).json({ success: true, message: "User logged out successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const sendverifyOtp = async (req, res) => {
  try {
    const {userId}=req.user;
    const user= await userModel.findById(userId);
    if(user.isVerified){
      return res.status(400).json({ success: false, message: "User is already verified" });
    }
    const otp= String(Math.floor(1000 + Math.random() * 9000));
    user.verifyOtp=otp;
    user.verifyOtpExpireAt=Date.now()+10*60*1000; //10 minutes
    await user.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify your email",
      //text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Verification OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const verifyOtp = async (req, res) => {
    const {userId}=req.user;
    const {otp}=req.body;
    if(!userId || !otp){
      return res.status(400).json({ success: false, message: "User ID and OTP are required" });
    }
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (user.verifyOtp === '' || user.verifyOtp !== otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }
      if (user.verifyOtpExpireAt < Date.now()) {
        return res.status(400).json({ success: false, message: "OTP expired" });
      }
      user.isVerified = true;
      user.verifyOtp = '';
      user.verifyOtpExpireAt =0;
      await user.save();
      res.status(200).json({ success: true, message: "User verified successfully" });
    } catch (error) {
      return res.json({success:false, message:error.message});
    }
}

export const isAuthenticated = (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetOtp =async (req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.status(400).json({ success: false, message: "Email is required" });
  }
  try {
    const user= await userModel.findOne({email});
    if(!user){
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const otp= String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp=otp;
    user.resetOtpExpireAt=Date.now()+10*60*1000; //10 minutes
    await user.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      //text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Reset OTP sent to email" });
  } catch (error) {
    return res.json({success:false, message:error.message});
  }
  
}

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
