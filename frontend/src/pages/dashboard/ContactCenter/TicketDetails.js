// TicketDetails.jsx
import React, { useState, useMemo } from "react";
import "./TicketDetails.css";
import { getAvatar } from "../../../utils/avatar";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

const teamAvatarCache = JSON.parse(localStorage.getItem("teamAvatars")) || {};

const getTeamAvatar = (user) => {
  if (!user) return "";

  const id = user._id || user.id;
  if (teamAvatarCache[id]) return teamAvatarCache[id];

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const isFemale = name.toLowerCase().endsWith("a");
  const randomIndex = Math.floor(Math.random() * 50);

  const url = isFemale
    ? `https://randomuser.me/api/portraits/women/${randomIndex}.jpg`
    : `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;

  teamAvatarCache[id] = url;
  localStorage.setItem("teamAvatars", JSON.stringify(teamAvatarCache));

  return url;
};

const TicketDetails = ({
  ticket,
  team = [],
  onAssignRequest,
  onResolveRequest,
}) => {
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [statusOpen, setStatusOpen] = useState(true);

  // SORT TEAM: admins first
  const sortedTeam = useMemo(() => {
    if (!team) return [];
    return [
      ...team.filter((t) => (t.role || "").toLowerCase() === "admin"),
      ...team.filter((t) => (t.role || "").toLowerCase() !== "admin"),
    ];
  }, [team]);

  const assignedUser = useMemo(() => {
    if (!ticket || !sortedTeam) return null;

    return (
      sortedTeam.find((u) => {
        if (!ticket.assignedTo) return false;

        const uId = u._id?.toString();
        const assignedId =
          ticket.assignedTo._id?.toString() || ticket.assignedTo?.toString();

        return uId === assignedId;
      }) || sortedTeam[0]
    );
  }, [sortedTeam, ticket]);

  if (!ticket)
    return <div className="td-empty">Select a ticket to view details</div>;
  if (!team)
    return <div className="td-empty">Unable to load chat details.</div>;

  const userAvatar = getAvatar(ticket._id, ticket.userName || "", "user");
  const userName = ticket.userName || ticket.user?.name || "Unknown User";
  const userPhone = ticket.userPhone || ticket.user?.phone || "Not Provided";
  const userEmail = ticket.userEmail || ticket.user?.email || "No Email";

  return (
    <div className="td-wrap">
      {/* HEADER */}
      <div className="td-user">
        <img src={userAvatar} className="td-user-avatar" alt="avatar" />
        <div>
          <div className="td-user-name-main">{userName}</div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="td-details-section">
        <h3>Details</h3>

        <div className="td-detail-box">
          <FaUser className="td-detail-icon" />
          <span className="td-detail-text">{userName}</span>
        </div>

        <div className="td-detail-box">
          <FaPhone className="td-detail-icon" />
          <span className="td-detail-text">{userPhone}</span>
        </div>

        <div className="td-detail-box">
          <FaEnvelope className="td-detail-icon" />
          <span className="td-detail-text">{userEmail}</span>
        </div>
      </div>

      {/* TEAMMATES */}
      <div className="td-section">
        <div className="td-section-head">Teammates</div>

        {/* COLLAPSIBLE CONTENT */}
        {teamDropdownOpen && (
          <div className="td-assign-box">
            <div className="td-select" onClick={() => setDropdown(!dropdown)}>
              {assignedUser ? (
                <div className="td-select-inner">
                  <img
                    src={getTeamAvatar(assignedUser)}
                    className="td-select-avatar"
                    alt=""
                  />
                  <div className="td-select-text">
                    <div className="td-select-name">
                      {assignedUser.firstName || assignedUser.name}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="td-select-placeholder">Select Teammate</div>
              )}
            </div>

            {dropdown && (
              <div className="td-dropdown">
                {sortedTeam.map((m) => (
                  <div
                    key={m._id}
                    className="td-dd-item"
                    onClick={() => {
                      setDropdown(false);
                      onAssignRequest(ticket, m._id);
                    }}
                  >
                    <img
                      src={getTeamAvatar(m)}
                      className="td-dd-avatar"
                      alt=""
                    />

                    <div className="td-dd-text">
                      <div className="td-dd-name">{m.firstName || m.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* STATUS */}
      <div className="td-section">
        <div
          className="td-section-head-status"
          onClick={() => setStatusOpen(!statusOpen)}
        >
          <span>📃 Ticket Status</span>
          <span>{statusOpen ? "▾" : "▸"}</span>
        </div>

        {statusOpen && (
          <div className="td-list">
            <div
              className="td-status-btn"
              onClick={() => onResolveRequest(ticket, "Resolved")}
            >
              Resolved
            </div>
            <div
              className="td-status-btn"
              onClick={() => onResolveRequest(ticket, "Unresolved")}
            >
              Unresolved
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
