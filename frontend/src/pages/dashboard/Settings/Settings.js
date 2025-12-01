import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useNavigate, useLocation } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const localUser = JSON.parse(localStorage.getItem("user"));

  // From Team Page
  const editUserFromTeam = JSON.parse(localStorage.getItem("editUser"));
  const editingUser = editUserFromTeam || localUser;

  const isSelf = localUser._id === editingUser._id;
  const isAdmin = localUser.role === "admin";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        email: editingUser.email || "",
        phone: editingUser.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

    // Email editable only by admin
    if (isAdmin) {
      payload.email = form.email;
    }

    if (form.password) {
      payload.password = form.password;
    }

    try {
      const res = await api.put(`/users/${editingUser._id}`, payload);
      const updatedUser = res.data.user;

      alert("Profile updated successfully");

      // Update localStorage only if editing yourself
      if (isSelf) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Clear temp edit user
      localStorage.removeItem("editUser");

      // ------------------------------
      // 🔥 PASSWORD CHANGE LOGIC
      // ------------------------------
      if (form.password) {
        if (isSelf) {
          alert("Password changed — please login again");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }

        // Admin editing member → NO logout
        alert("Member password updated successfully");
        return;
      }

      // ------------------------------
      // 🔥 NAME UPDATE ONLY → STAY HERE
      // ------------------------------
      return;

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      <div className="edit-container">
        <h2>Edit Profile</h2>

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
              disabled={!isAdmin} // <-- ONLY admin can edit email
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="New Password"
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
