import React, { useState } from "react";
import "./AddMemberModal.css";

const AddMemberModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    designation: "Member", // Default value
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.firstName || !form.email) {
      alert("Please fill required fields (User name & Email).");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box big">
        <h2>Add Team members</h2>

        <p className="modal-desc">
          Talk with colleagues in a group chat. Messages in this group are only
          visible to its participants. New <br /> teammates may only be invited by the
          administrators.
        </p>

        <div className="form-row">
          <label>User name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="User name"
          />
        </div>

        <div className="form-row">
          <label>Email ID</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email ID"
          />
        </div>

        <div className="form-row">
          <label>Designation</label>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="designation-select"
          >
            <option value="Member">Member</option>
          </select>
        </div>

        <div style={{ height: 24 }}></div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
