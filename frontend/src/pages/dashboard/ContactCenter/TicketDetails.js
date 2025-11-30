import React, { useState } from "react";
import "./TicketDetails.css";
import { getAvatar } from "../../../utils/avatar";

const TicketDetails = ({ ticket, team = [], onAssignRequest, onResolveRequest }) => {
  const [teamOpen, setTeamOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(true);

  if (!ticket) {
    return <div className="td-empty">Select a ticket to view details</div>;
  }

  const handleAssignClick = (memberId) => onAssignRequest(ticket, memberId);

  const handleStatusClick = (status) => onResolveRequest(ticket, status);

  const userAvatar = getAvatar(ticket._id, ticket.userName, "user");

  return (
    <div className="td-wrap">

      {/* USER DETAILS */}
      <div className="td-user">
        <div className="td-avatar">
          <img src={userAvatar} alt="user-avatar" />
        </div>
        <div>
          <div className="td-user-name">{ticket.userName || "Unknown"}</div>
          <div className="td-email">{ticket.userEmail}</div>
        </div>
      </div>

      {/* TEAMMATES SECTION */}
      <div className="td-section">
        <div className="td-section-head" onClick={() => setTeamOpen(!teamOpen)}>
          <span>Teammates</span>
          <span>{teamOpen ? "▾" : "▸"}</span>
        </div>

        {teamOpen && (
          <div className="td-list">
            {team.map((m) => {
              const avatar = getAvatar(m._id, m.name, "teammate");
              return (
                <div key={m._id} className="td-item" onClick={() => handleAssignClick(m._id)}>
                  <div className="td-item-avatar">
                    <img src={avatar} alt="member-avatar" />
                  </div>
                  <div className="td-item-name">{m.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STATUS SECTION */}
      <div className="td-section">
        <div className="td-section-head" onClick={() => setStatusOpen(!statusOpen)}>
          <span>Ticket status</span>
          <span>{statusOpen ? "▾" : "▸"}</span>
        </div>

        {statusOpen && (
          <div className="td-list">
            {["Open", "In Progress", "Resolved", "Missed"].map((st) => (
              <div key={st} className={`td-item ${ticket.status === st ? "active" : ""}`}
                onClick={() => handleStatusClick(st)}>
                {st}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default TicketDetails;
