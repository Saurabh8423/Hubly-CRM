import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateAvatar from "../utils/generateAvatar.js";

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
  try {
    const { firstName, lastName = "", email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // check lowercase role
    const adminExists = await User.exists({ role: "admin" });

    // assign lowercase valid enum values
    const role = adminExists ? "member" : "admin";


    const hashed = await bcrypt.hash(password, 10);

    // Generate avatar BEFORE creating user
    const avatar = generateAvatar();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role,
      avatar,
      status: "active",
      phone: "+1(000)000-0000",
    });


    const out = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    };

    res.json({ success: true, message: "Account created", user: out });

  } catch (err) {
    console.error("SIGNUP ERR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Logged in",
      token,
      user: {
        _id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
