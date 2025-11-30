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
          from: m.senderId ? "agent" : "user", // classify
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

    try {
      const res = await sendMessageAPI({ ticketId: selected._id, text: input });

      if (res.data?.message) {
        setMessages((prev) => [
          ...prev,
          { ...res.data.message, from: res.data.message.senderId ? "agent" : "user" }
        ]);
        setInput("");
        await loadAll();
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
            const status = t.status || "Open";

            const avatar = getAvatar(t._id, t.userName, "user");

            return (
              <div key={t._id} className={`hb-chat-item ${isSelected ? "selected" : ""}`}
                onClick={() => selectTicket(t)}>
                
                <div className="hb-chat-thumb">
                  <img src={avatar} alt="avatar" />
                </div>

                <div className="hb-chat-meta">
                  <div className="hb-chat-title">{t.userName || t.userEmail || t.ticketId}</div>
                  <div className="hb-chat-last">{last}</div>
                </div>

                <div className={`hb-chat-status ${status.toLowerCase().replace(" ", "-")}`}>
                  {status}
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
          <div className="hb-home-icon" title="Go to dashboard">🏠</div>
        </div>

        <div className="hb-message-area">
          {selected ? (
            <>
              <div className="hb-date-sep">— {new Date(selected.createdAt).toLocaleDateString()} —</div>

              <div className="hb-messages">
                {messages.length ? messages.map(m => {
                  const avatar = getAvatar(
                    m._id,
                    m.from === "user" ? selected.userName : m.senderName,
                    m.from === "user" ? "user" : (m.senderRole || "agent")
                  );

                  return (
                    <div key={m._id} className={`hb-msg ${m.from === "user" ? "hb-msg-user" : "hb-msg-agent"}`}>
                      <img className="hb-msg-avatar" src={avatar} alt="avatar" />
                      <div className="hb-msg-body">{m.text}</div>
                    </div>
                  );
                }) : <div className="hb-no-messages">No messages yet.</div>}
              </div>

              <div className="hb-reply-area">
                {selected.isMissed && <div className="hb-missed-note">Replying to missed chat</div>}

                <textarea placeholder="Type here" value={input} onChange={(e) => setInput(e.target.value)} />
                <button className="hb-send" onClick={handleSend}>➤</button>
              </div>
            </>
          ) : <div className="hb-select-note">Select a chat to view messages</div>}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hb-right-panel">
        <TicketDetails ticket={selected} team={team} onAssignRequest={onAssignRequest} onResolveRequest={onResolveRequest} />
      </div>

      {assigningTicket && (
        <AssignConfirm ticket={assigningTicket.ticket} toUserId={assigningTicket.toUserId}
          onClose={() => setAssigningTicket(null)} onSuccess={async () => {
            setAssigningTicket(null); await loadAll(); if (selected) await selectTicket(selected);
        }}/>
      )}

      {resolvingTicket && (
        <ResolveConfirm ticket={resolvingTicket.ticket} status={resolvingTicket.status}
          onClose={() => setResolvingTicket(null)} onSuccess={async () => {
            setResolvingTicket(null); await loadAll(); if (selected) await selectTicket(selected);
        }}/>
      )}
    </div>
  );
};

export default ContactCenter;
