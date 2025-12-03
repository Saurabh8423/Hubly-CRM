// ContactCenter.jsx
import React, { useEffect, useState } from "react";
import "./ContactCenter.css";

import { getTickets } from "../../../api/tickets";
import { getMessagesAPI, sendMessageAPI } from "../../../api/messages";
import { getUsers } from "../../../api/users";
import TicketDetails from "./TicketDetails";
import AssignConfirm from "./AssignConfirm";
import ResolveConfirm from "./ResolveConfirm";
import { getAvatar } from "../../../utils/avatar";

const ContactCenter = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [team, setTeam] = useState([]);
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  // Get current user from localStorage (if present)
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    loadAll();
    loadTeam();
  }, []);

  const loadAll = async () => {
    try {
      const res = await getTickets({});
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("loadAll tickets error", err);
    }
  };

  const loadTeam = async () => {
    try {
      const res = await getUsers();
      setTeam(res.data.users || res.data || []);
    } catch (err) {
      console.error("loadTeam error", err);
    }
  };

  const selectTicket = async (ticket) => {
    setSelected(ticket);
    try {
      const res = await getMessagesAPI(ticket._id);

      if (res.data?.messages) {
        const mapped = res.data.messages.map((m) => ({
          ...m,
          from: m.senderId ? "agent" : "user",
        }));
        setMessages(mapped);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("load messages", err);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selected) return;

    if (selected.status === "Resolved") {
      return alert("This chat has been resolved and cannot be replied to.");
    }

    // If the ticket is now assigned to someone else and current user is not the assignee and not admin, block sending
    const assignedTo = selected?.assignedTo?._id || selected?.assignedTo;
    const isAdmin = currentUser?.role === "admin";
    const isAssignee = currentUser && assignedTo && currentUser._id === assignedTo;

    if (!isAdmin && assignedTo && !isAssignee) {
      return alert("You no longer have access to reply to this chat.");
    }

    try {
      const payload = {
        ticketId: selected._id,
        text: input.trim(),
        senderId: currentUser ? currentUser._id : null,
      };

      const res = await sendMessageAPI(payload);

      if (res.data?.message) {
        setMessages((prev) => [
          ...prev,
          { ...res.data.message, from: res.data.message.senderId ? "agent" : "user" },
        ]);
        setInput("");
        await loadAll();

        // refresh selected ticket details
        const updated = (await getTickets({})).data.tickets.find((t) => t._id === selected._id);
        if (updated) setSelected(updated);
      }
    } catch (err) {
      console.error("send error", err);
    }
  };

  const onAssignRequest = (ticket, toUserId) => setAssigningTicket({ ticket, toUserId });
  const onResolveRequest = (ticket, status) => setResolvingTicket({ ticket, status });

  const filtered = tickets.filter((t) => {
    if (!search) return true;
    return (t.ticketId || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.userName || "").toLowerCase().includes(search.toLowerCase());
  });

  // helper to test if current user can access selected ticket
  const hasAccess = (ticket) => {
    if (!ticket) return true;
    if (!currentUser) return true; // anonymous considered as allowed in UI (depends on your auth)
    if (currentUser.role === "admin") return true;
    const assignedId = ticket?.assignedTo?._id || ticket?.assignedTo;
    if (!assignedId) return true; // unassigned -> open
    return assignedId === currentUser._id;
  };

  return (
    <div className="hb-contact-wrap">

      {/* LEFT PANEL */}
      <div className="hb-left-panel">
        <div className="hb-left-header">Contact Center</div>

        <div className="hb-chat-list">
          <h2>Chats</h2>

          {filtered.length ? filtered.map((t) => {
            const isSelected = selected && selected._id === t._id;
            const last = t.lastMessage ? t.lastMessage.text : "";
            const avatar = getAvatar(t._id, t.userName || "", "user");

            // Show 'No longer have access' if the currently signed-in user lost access to this chat
            const access = hasAccess(t);
            const previewText = !access ? "No longer have access" : last;

            return (
              <div key={t._id}
                className={`hb-chat-item ${isSelected ? "selected" : ""}`}
                onClick={() => selectTicket(t)}>

                <div className="hb-chat-thumb">
                  <img src={avatar} alt="avatar" />
                </div>

                <div className="hb-chat-meta">
                  <div className="hb-chat-title">{t.userName || t.userEmail || t.ticketId}</div>
                  <div className="hb-chat-last">{previewText}</div>
                </div>

              </div>
            );
          }) : <div className="hb-empty">No chats found.</div>}
        </div>
      </div>

      {/* CENTER PANEL */}
      <div className="hb-center-panel">
        <div className="hb-center-header">
          <div>{selected ? `Ticket# ${selected.ticketId}` : "Ticket# -"}</div>
          <div className="hb-home-icon" title="Go to dashboard">🏠︎</div>
        </div>

        <div className="hb-message-area">
          {selected ? (
            <>
              <div className="hb-messages">
                {messages.length ? messages.map((m, idx) => {
                  // --- NEW AVATAR LOGIC ---
                  let avatar = "";

                  // If message is from USER → use getAvatar()
                  if (m.from === "user") {
                    avatar = getAvatar(
                      selected._id,
                      selected.userName || selected.userEmail || "User",
                      "user"
                    );
                  }

                  // If message is from AGENT → use TEAM AVATAR (same as right panel)
                  if (m.from === "agent") {
                    const agentData = team.find((t) => t._id === m.senderId);

                    if (agentData) {
                      const fullName = `${agentData.firstName || ""} ${agentData.lastName || ""}`.trim();

                      const id = agentData._id;
                      const cache = JSON.parse(localStorage.getItem("teamAvatars")) || {};

                      if (cache[id]) {
                        avatar = cache[id];
                      } else {
                        const isFemale = fullName.toLowerCase().endsWith("a");
                        const randomIndex = Math.floor(Math.random() * 50);
                        const url = isFemale
                          ? `https://randomuser.me/api/portraits/women/${randomIndex}.jpg`
                          : `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;

                        cache[id] = url;
                        localStorage.setItem("teamAvatars", JSON.stringify(cache));
                        avatar = url;
                      }
                    }
                  }

                  let name = "";

                  if (m.from === "user") {
                    name = selected.userName || selected.userEmail || "User";
                  } else {
                    const agentData = team.find((t) => t._id === m.senderId);
                    name = agentData
                      ? `${agentData.firstName} ${agentData.lastName}`
                      : "Team Member";
                  }

                  // render date above message when date changes or it's the first message
                  const prev = idx > 0 ? messages[idx - 1] : null;
                  const prevDate = prev ? new Date(prev.createdAt).toDateString() : null;
                  const thisDate = m.createdAt ? new Date(m.createdAt).toDateString() : null;
                  const showDate = !prevDate || prevDate !== thisDate;

                  return (
                    <React.Fragment key={m._id || `${idx}-${m.createdAt}`}>
                      {showDate && (
                        <div className="hb-date-inline">— {thisDate} —</div>
                      )}

                      <div className={`hb-msg-wrap ${m.from === "user" ? "user-side" : "agent-side"}`}>

                        {/* AVATAR */}
                        <img className="hb-msg-avatar" src={avatar} alt="avatar" />

                        {/* NAME + MESSAGE  */}
                        <div>
                          <div className="hb-msg-name">{name}</div>

                          <div className={`hb-msg ${m.from === "user" ? "hb-msg-user" : "hb-msg-agent"}`}>
                            {m.text}
                          </div>
                        </div>

                      </div>
                    </React.Fragment>
                  );
                }) : <div className="hb-no-messages">No messages yet.</div>}
              </div>

              <div className="hb-reply-area">
                {/* If current user doesn't have access show locked notice */}
                {!hasAccess(selected) ? (
                  <div className="hb-locked-note">This chat is assigned to new team member. You no longer have access.</div>
                ) : selected.status === "Resolved" ? (
                  <div className="hb-resolved-banner">This chat has been resolved.</div>
                ) : (
                  <>
                    {selected.isMissed && <div className="hb-missed-note">Replying to missed chat</div>}

                    <textarea
                      placeholder="Type here"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="hb-send" onClick={handleSend}>➤</button>
                  </>
                )}
              </div>
            </>
          ) : <div className="hb-select-note">Select a chat to view messages</div>}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hb-right-panel">
        <TicketDetails
          ticket={selected}
          team={team}
          onAssignRequest={(ticket, toUserId) => {
            // open confirm modal in parent
            setAssigningTicket({ ticket, toUserId });
          }}
          onResolveRequest={(ticket, status) => {
            setResolvingTicket({ ticket, status });
          }}
        />
      </div>

      {assigningTicket && (
        <AssignConfirm
          ticket={assigningTicket.ticket}
          toUserId={assigningTicket.toUserId}
          onClose={() => setAssigningTicket(null)}
          onSuccess={async () => {
            setAssigningTicket(null);
            await loadAll();
            // Refresh selected to reflect assignedTo change
            if (selected) {
              const updated = (await getTickets({})).data.tickets.find(t => t._id === selected._id);
              if (updated) setSelected(updated);
            }
          }}
        />
      )}

      {resolvingTicket && (
        <ResolveConfirm
          ticket={resolvingTicket.ticket}
          status={resolvingTicket.status}
          onClose={() => setResolvingTicket(null)}
          onSuccess={async () => {
            setResolvingTicket(null);
            await loadAll();
            if (selected) {
              const updated = (await getTickets({})).data.tickets.find(t => t._id === selected._id);
              if (updated) setSelected(updated);
            }
          }}
        />
      )}
    </div>
  );
};

export default ContactCenter;
