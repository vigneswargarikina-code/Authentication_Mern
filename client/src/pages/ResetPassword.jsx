import React, { useState, useRef, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const {data}=await axios.post(backendUrl+'/api/auth/reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray =inputRefs.current.map(e=>e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
    
  };

  const onSubmitNewPassword =async (e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post(backendUrl+'/api/auth/reset-password', { email, otp, newPassword });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{4}$/.test(pastedData)) {
      pastedData.split("").forEach((char, i) => {
        inputRefs.current[i].value = char;
        if (i < 3) {
          inputRefs.current[i + 1].focus();
        }
      });
      setOtp(pastedData);
    }
  };

  const handleOtpInput = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    let otpArr = otp.split("");
    otpArr[index] = value;
    setOtp(otpArr.join(""));
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Reset Password"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      {!isEmailSent && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={onSubmitEmail}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Your Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered Email ID
          </p>
          <div className="flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img
              src={assets.mail_icon}
              alt="Email"
              className="w-6 h-6 inline-block mr-2"
            />
            <input
              type="email"
              placeholder="Email ID"
              className="bg-transparent border-none outline-none text-white placeholder:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2 mt-4 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full transition-colors duration-200 hover:from-indigo-700 hover:to-indigo-950"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={onSubmitOTP}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 4-digit code sent to your Email ID
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpInput(e, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                />
              ))}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 mt-4 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full transition-colors duration-200 hover:from-indigo-700 hover:to-indigo-950"
          >
            Submit
          </button>
        </form>
      )}

      {isOtpSubmitted && (
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={onSubmitNewPassword}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your new password
          </p>
          <div className="flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img
              src={assets.lock_icon}
              alt="Lock"
              className="w-6 h-6 inline-block mr-2"
            />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent border-none outline-none text-white placeholder:text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-2 mt-4 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full transition-colors duration-200 hover:from-indigo-700 hover:to-indigo-950"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
