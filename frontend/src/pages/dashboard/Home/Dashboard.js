import React, { useEffect, useState } from "react";
import { getTickets } from "../../../api/tickets";
import "./Dashboard.css";
import { CiSearch } from "react-icons/ci";

// Avatar Cache
const avatarCache = JSON.parse(localStorage.getItem("ticketAvatars")) || {};

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await getTickets();
      const t = res.data?.tickets || res.data?.data || res.data;
      setTickets(t || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Avatar generator
  const getAvatar = (ticket) => {
    const ticketId = ticket._id;

    if (avatarCache[ticketId]) return avatarCache[ticketId];

    const name =
      ticket.userName ||
      ticket.user?.name ||
      ticket.userEmail ||
      "User";

    const isFemale = name?.toLowerCase().endsWith("a");
    const randomIndex = Math.floor(Math.random() * 50);

    const avatarURL = isFemale
      ? `https://randomuser.me/api/portraits/women/${randomIndex}.jpg`
      : `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;

    avatarCache[ticketId] = avatarURL;
    localStorage.setItem("ticketAvatars", JSON.stringify(avatarCache));

    return avatarURL;
  };

  // -------------------------------
  // 🔥 TAB FILTER FIRST
  // -------------------------------
  const filteredByTab = tickets.filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "resolved") return t.status === "Resolved";
    if (activeTab === "unresolved")
      return t.status === "Open" || t.status === "In Progress";
    return true;
  });

  // -------------------------------
  //  SEARCH LOGIC (FULL MATCHES + PARTIAL MATCHES)
  // -------------------------------
  const text = search.toLowerCase().trim();

  // Automatic Tab Switching: partial matching
  useEffect(() => {
  if (text.startsWith("all")) {
    setActiveTab("all");
  } else if (text.startsWith("reso")) {
    setActiveTab("resolved");
  } else if (text.startsWith("unres")) {
    setActiveTab("unresolved");
  }
}, [text]);


  // -------------------------------
  // 🔥 SEARCH IN TICKET DATA
  // -------------------------------
  const fullyFiltered = filteredByTab.filter((t) => {
    if (!text) return true;

    const userName =
      t.userName || t.user?.name || "Unknown User";

    const userPhone =
      t.userPhone || t.user?.phone || t.phone || "";

    const userEmail =
      t.userEmail || t.user?.email || t.email || "";

    const lastMessage = t.lastMessage?.text || "";

    return (
      t.ticketId?.toLowerCase().includes(text) ||
      userName?.toLowerCase().includes(text) ||
      userPhone?.toLowerCase().includes(text) ||
      userEmail?.toLowerCase().includes(text) ||
      lastMessage?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="dashboard-wrapper">

        {/* SEARCH */}
        <div className="dash-search-wrapper">
          <CiSearch className="dash-search-google-icon" />
          <input
            type="text"
            placeholder="Search for ticket"
            className="dash-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABS */}
        <div className="dash-tabs">
          <button
            className={activeTab === "all" ? "tab active" : "tab"}
            onClick={() => setActiveTab("all")}
          >
            All Tickets
          </button>

          <button
            className={activeTab === "resolved" ? "tab active" : "tab"}
            onClick={() => setActiveTab("resolved")}
          >
            Resolved
          </button>

          <button
            className={activeTab === "unresolved" ? "tab active" : "tab"}
            onClick={() => setActiveTab("unresolved")}
          >
            Unresolved
          </button>
        </div>

        {/* TICKET LIST */}
        <div
          className="ticket-list"
          style={{ display: "flex", gap: 20, flexDirection: "column" }}
        >
          {fullyFiltered.map((t) => {
            const userName =
              t.userName || t.user?.name || "Unknown User";

            const userPhone =
              t.userPhone || t.user?.phone || t.phone || "Not Provided";

            const userEmail =
              t.userEmail || t.user?.email || t.email || "No Email";

            return (
              <div key={t._id} className="ticket-card">
                {/* TOP */}
                <div className="ticket-top">
                  <div className="ticket-left">
                    <span className="ticket-dot"></span>

                    <div>
                      <p className="ticket-id">Ticket# {t.ticketId}</p>
                      <p className="ticket-msg">
                        {t.lastMessage?.text || "No message"}
                      </p>
                    </div>
                  </div>

                  <div className="ticket-right">
                    <p className="ticket-posted">
                      Posted at{" "}
                      {new Date(t.createdAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                {/* USER INFO */}
                <div className="ticket-bottom">
                  <div className="ticket-user">
                    <img
                      src={getAvatar(t)}
                      className="ticket-avatar"
                      alt="user"
                    />

                    <div>
                      <p className="ticket-username">{userName}</p>
                      <p className="ticket-meta">{userPhone}</p>
                      <p className="ticket-meta">{userEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
