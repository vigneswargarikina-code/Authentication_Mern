import jwt from "jsonwebtoken";

const userauth = async (req, res, next) => {
  const token = req.cookies.token; // get the token from cookies
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      req.user = { userId: decoded.id }; // store user info safely
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, Login required" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default userauth;
