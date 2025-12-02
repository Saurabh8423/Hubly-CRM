// AssignConfirm.jsx
import React, { useState } from "react";
import { assignTicket } from "../../../api/tickets";
import "./AssignConfirm.css";

const AssignConfirm = ({ ticket, toUserId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    try {
      setLoading(true);
      await assignTicket(ticket._id, toUserId);
      setLoading(false);
      onSuccess && onSuccess();
    } catch (err) {
      setLoading(false);
      alert("Assign failed");
      console.error(err);
    }
  };

  return (
    <>
      <div className="assign-confirm-backdrop" onClick={onClose} />
      <div className="assign-confirm">
        <div className="assign-text">Chat would be assigned to Different team member</div>
        <div className="assign-actions">
          <button className="assign-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="assign-confirm-btn" onClick={confirm} disabled={loading}>
            {loading ? "Assigning..." : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AssignConfirm;
