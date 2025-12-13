import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ------------------------- GET ALL USERS -------------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------- CREATE USER -------------------------
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      phone: phone || "+1(000)000-0000",
      role: role || "member",
      password: "Hubly@123",
    });


    await user.save();

    res.json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ------------------------- UPDATE USER -------------------------
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = req.user; // from authMiddleware (decoded token)

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isSelf = loggedInUser._id === id;
    const isAdmin = loggedInUser.role === "admin";

    // -------- ROLE PERMISSIONS --------
    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit another user",
      });
    }

    // -------- FIELD UPDATE RULES --------
    const { firstName, lastName, email, password, phone } = req.body;

    // Admin → can update everything
    if (isAdmin) {
      if (email) user.email = email;
      if (phone) user.phone = phone;
      user.firstName = firstName ?? user.firstName;
      user.lastName = lastName ?? user.lastName;
    }

    // Member → can only edit self name + password
    if (!isAdmin && isSelf) {
      user.firstName = firstName ?? user.firstName;
      user.lastName = lastName ?? user.lastName;

      // member cannot change email
    }

    // Password update (allowed for both Self + Admin)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...user._doc,
        password: undefined, // hide password
      },
    });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------- DELETE USER -------------------------
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Only admin can delete
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete users",
      });
    }

    // Prevent deleting other admins
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
