// ResolveConfirm.jsx
import React, { useState } from "react";
import { updateTicketStatus } from "../../../api/tickets";

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
    <div style={{
      position:"fixed", right:120, top:180, zIndex:9999, background:"#fff", padding:18,
      borderRadius:14, boxShadow:"0 12px 30px rgba(0,0,0,0.15)"
    }}>
      <div style={{marginBottom:12}}>Chat will be {status === "Resolved" ? "closed" : `marked ${status}`}</div>
      <div style={{display:"flex", gap:8, justifyContent:"flex-end"}}>
        <button onClick={onClose} disabled={loading}>Cancel</button>
        <button onClick={confirm} disabled={loading} style={{background:"#184f7c", color:"#fff"}}>{loading ? "Saving..." : "Confirm"}</button>
      </div>
    </div>
  );
};

export default ResolveConfirm;
