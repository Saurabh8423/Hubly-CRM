import jwt from "jsonwebtoken";
import User from "../models/User.js";


const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};



export default authMiddleware;
