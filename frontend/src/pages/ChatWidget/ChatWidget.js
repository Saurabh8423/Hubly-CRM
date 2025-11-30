// src/components/Chat/ChatWidget.jsx
import React, { useEffect, useState } from "react";
import "./ChatWidget.css";
import { IoIosSend } from "react-icons/io";
import fabIcon from "../../../src/Assets/icon-floating.png";
import botIcon from "../../../src/Assets/Ellipse 6.png";

import { createTicket, sendMessageAPI, getMessagesAPI } from "../../api/messages";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [showIntroForm, setShowIntroForm] = useState(false);
  const [introForm, setIntroForm] = useState({ name: "", phone: "", email: "" });
  const [introSubmitting, setIntroSubmitting] = useState(false);

  /* ------------------------- Load Messages ------------------------- */
  useEffect(() => {
    if (ticket) {
      loadMessages(ticket._id);
    }
  }, [ticket]);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next === true) setShowPopup(false);
      else setShowPopup(true);
      return next;
    });
  };

  const openFromPopup = () => {
    setOpen(true);
    setShowPopup(false);
  };

  const loadMessages = async (ticketId) => {
    try {
      const res = await getMessagesAPI(ticketId);

      if (res.data?.messages) {
        const clean = res.data.messages.map((m) => ({
          _id: m._id || Math.random(),
          text: typeof m.text === "string" ? m.text : "",
          senderId: m.senderId || null,
          from: m.senderId ? "bot" : "user",
          createdAt: m.createdAt,
        }));

        setMessages(clean);
      }
    } catch (err) {
      console.error("Load messages error", err);
    }
  };

  /* ------------------------------ SEND ------------------------------ */
  const handleSend = async () => {
    const txt = input.trim();
    if (!txt) return;

    // No ticket → open intro form
    if (!ticket) {
      setMessages((prev) => [
        ...prev,
        {
          _id: Math.random(),
          text: txt,
          createdAt: new Date(),
          from: "user",
        },
      ]);

      setInput("");
      setShowIntroForm(true);
      return;
    }

    // Send to backend
    try {
      const res = await sendMessageAPI({
        ticketId: ticket._id,
        text: txt,
      });

      if (res.data?.message) {
        const m = res.data.message;

        setMessages((prev) => [
          ...prev,
          {
            _id: m._id,
            text: m.text,
            senderId: m.senderId,
            from: m.senderId ? "bot" : "user",
            createdAt: m.createdAt,
          },
        ]);
        setInput("");
      }
    } catch (err) {
      console.error("send error", err);
    }
  };

  /* --------------------------- INTRO FORM --------------------------- */
  const submitIntro = async (e) => {
    e?.preventDefault();
    setIntroSubmitting(true);

    try {
      const res = await createTicket({
        name: introForm.name,
        email: introForm.email,
        phone: introForm.phone,
      });

      const newTicket = res.data.ticket;
      setTicket(newTicket);
      setShowIntroForm(false);

      // send last typed user message automatically
      const lastUser = [...messages].reverse().find((m) => m.from === "user");

      if (lastUser) {
        await sendMessageAPI({
          ticketId: newTicket._id,
          text: lastUser.text,
        });
      }

      await loadMessages(newTicket._id);
      setIntroSubmitting(false);
    } catch (err) {
      console.error("intro submit error", err);
      setIntroSubmitting(false);
      alert("Unable to create ticket. Try again.");
    }
  };

  const isUserMessage = (m) => {
    if (m.from === "user") return true;
    if (!m.senderId) return true;
    return false;
  };

  /* ------------------------------ UI ------------------------------ */
  return (
    <>
      {/* Popup */}
      {!open && showPopup && (
        <div className="chat-popup">
          <div className="popup-top">
            <img
              src={botIcon}
              alt="bot"
              className="popup-bot-img"
              onClick={openFromPopup}
            />
          </div>

          <div className="popup-body">
            <p>👋 Want to chat about Hubly? I’m a chatbot here to help you find your way.</p>
          </div>

          <button
            className="popup-close"
            onClick={() => {
              setShowPopup(false);
              setOpen(false);
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div className="chat-panel-left">
              <img src={botIcon} alt="bot" className="panel-bot" />
              <div className="panel-title">Hubly</div>
            </div>

            <button className="chat-panel-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-panel-body">
            <div className="message-feed">
              {messages.map((m, i) => {
                const userMsg = isUserMessage(m);
                return (
                  <div key={m._id ?? i} className={`message-row ${userMsg ? "row-user" : "row-bot"}`}>
                    {!userMsg && <img src={botIcon} alt="bot" className="msg-bot-icon" />}
                    <div className={`bubble ${userMsg ? "bubble-user" : "bubble-bot"}`}>
                      <div className="bubble-text">{m.text}</div>

                      {m.senderId && (
                        <span className="msg-send-icon">
                          <IoIosSend size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {showIntroForm && (
              <div className="intro-row">
                <img src={botIcon} alt="bot" className="msg-bot-icon" />
                <form className="intro-box" onSubmit={submitIntro}>
                  <h4>Introduction Yourself</h4>

                  <label>Your name</label>
                  <input
                    name="name"
                    value={introForm.name}
                    onChange={(e) => setIntroForm({ ...introForm, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />

                  <label>Your Phone</label>
                  <input
                    name="phone"
                    value={introForm.phone}
                    onChange={(e) => setIntroForm({ ...introForm, phone: e.target.value })}
                    placeholder="+91-9XX..."
                    required
                  />

                  <label>Your Email</label>
                  <input
                    name="email"
                    value={introForm.email}
                    onChange={(e) => setIntroForm({ ...introForm, email: e.target.value })}
                    placeholder="example@gmail.com"
                    required
                  />

                  <button type="submit" className="intro-submit">
                    {introSubmitting ? "Sending..." : "Thank You!"}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="chat-panel-footer">
            <input
              placeholder="Write a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button className="sends-btn" onClick={handleSend}>
              <IoIosSend size={20} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button className={`hb-fab ${open ? "open" : ""}`} onClick={toggle}>
        {open ? <span className="fab-x">✕</span> : <img src={fabIcon} alt="chat" />}
      </button>
    </>
  );
}
