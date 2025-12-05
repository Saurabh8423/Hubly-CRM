import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem("user"));
  const editUserFromTeam = JSON.parse(localStorage.getItem("editUser"));

  // If admin clicked edit → edit that user
  // If member clicked edit → edit self
  const editingUser = editUserFromTeam || localUser;

  const isSelf = localUser._id === editingUser._id;
  const isAdmin = localUser.role === "admin";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPasswordWarning, setShowPasswordWarning] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        email: editingUser.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      setShowPasswordWarning(e.target.value !== "");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
    };

    // Password optional
    if (form.password) payload.password = form.password;

    try {
      const res = await api.put(`/users/${editingUser._id}`, payload);
      const updatedUser = res.data.user;

      // Update localStorage only when editing self
      if (isSelf) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Remove editing user once saved
      localStorage.removeItem("editUser");

      // If password updated
      if (form.password) {
        if (isSelf) {
          // Logout immediately
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert("Member password updated successfully");
        }
        return;
      }

      alert("Profile updated successfully");

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
              disabled
            />
          </div>

          <div className="form-group password-field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />

            {showPasswordWarning && (
              <div className="password-warning">
                User will be logged out immediately
              </div>
            )}
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
