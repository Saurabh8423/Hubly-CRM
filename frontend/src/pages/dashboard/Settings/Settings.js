import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./Settings.css";

const Settings = () => {
  // Logged in user from localStorage
  const localUser = JSON.parse(localStorage.getItem("user"));

  // Check if admin clicked edit on another user
  const savedEditUser = localStorage.getItem("editUser");
  const targetUser = savedEditUser ? JSON.parse(savedEditUser) : localUser;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (targetUser) {
      setForm({
        firstName: targetUser.firstName || "",
        lastName: targetUser.lastName || "",
        email: targetUser.email || "",
        phone: targetUser.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [targetUser]);

  // Handle input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Save handler
  const handleSave = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    };

    // Admin can update email
    if (localUser.role === "admin") {
      payload.email = form.email;
    }

    if (form.password) {
      payload.password = form.password;
    }

    try {
      const res = await api.put(`/users/${targetUser._id}`, payload);
      const updatedUser = res.data.user;

      alert("Profile updated successfully");

      // If user updated themselves → update localStorage
      if (localUser._id === targetUser._id) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Clear editUser memory
      localStorage.removeItem("editUser");

      // If password changed → logout
      if (form.password) {
        alert("Password changed. Please login again.");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      <div className="edit-container">
        <h2 className="settings__title">Edit Profile</h2>

        <form className="edit-form" onSubmit={handleSave}>
          
          <div className="form-group">
            <label>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={localUser.role !== "admin"} 
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={localUser.role !== "admin"}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              name="password"
              type="password"
              placeholder="Leave blank to keep same"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="save-settings-btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
