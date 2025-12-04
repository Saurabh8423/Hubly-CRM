import React, { useState } from "react";
import { updateTicketStatus } from "../../../api/tickets";
import "./ResolveConfirm.css";

const ResolveConfirm = ({ ticket, status, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    try {
      setLoading(true);

      await updateTicketStatus(ticket._id, status);

      setLoading(false);
      onSuccess && onSuccess();
    } catch (err) {
      setLoading(false);
      alert("Update status failed");
      console.error(err);
    }
  };

  return (
    <div className="resolve-confirm-container">
      <div className="resolve-confirm-message">
        Chat will be{" "}
        {status === "Resolved" ? "closed" : `marked ${status}`}
      </div>

      <div className="resolve-confirm-actions">
        <button
          className="resolve-btn cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          className="resolve-btn confirm-btn"
          onClick={confirm}
          disabled={loading}
        >
          {loading ? "Saving..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ResolveConfirm;
