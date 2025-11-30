// ChatbotPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import Sidebar from "../../../components/dashboard/Sidebar/Sidebar";
import logoImage from "../../../Assets/Ellipse 6.png";
import "./Chatbot.css";

const ChatbotPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "How can I help you?", sender: "bot" },
    { text: "Ask me anything", sender: "bot" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const chatBodyRef = useRef(null);

  const [editableField, setEditableField] = useState(null);
  const [settings, setSettings] = useState({
    headerColor: localStorage.getItem("headerColor") || "#31475B",
    backgroundColor: localStorage.getItem("chatBgColor") || "#EEEEEE",
    messages: ["How can I help you?", "Ask me anything!"],
    welcomeMessage:
      "👋 Want to chat about Hubly? I'm an chatbot here to help you find your way.",
    formFields: {
      name: "Your name",
      phone: "+1 (000) 000-0000",
      email: "example@gmail.com",
    },
    missedTimer: { h: "00", m: "00", s: "00" },
  });

  const [formData, setFormData] = useState({ name: "", mobile: "", email: "" });
  const hoursRef = useRef(null);
  const minsRef = useRef(null);
  const secsRef = useRef(null);

  useEffect(() => {
    // Keep scroll at bottom whenever messages or form visibility changes
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, showForm]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { text: message.trim(), sender: "user" }]);
    setMessage("");
    if (!showForm) setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      { text: `Thank you, ${formData.name || "there"}!`, sender: "bot" },
    ]);
    setShowForm(false);
    setFormData({ name: "", mobile: "", email: "" });
  };

  // 🔥 SAVE to localStorage — Global Sync
  const setHeaderColor = (hex) => {
    setSettings((s) => ({ ...s, headerColor: hex }));
    localStorage.setItem("headerColor", hex);
  };

  const setBackgroundColor = (hex) => {
    setSettings((s) => ({ ...s, backgroundColor: hex }));
    localStorage.setItem("chatBgColor", hex);
  };

  const startEditing = (key) => {
    setEditableField(key);
    setTimeout(() => {
      const el = document.querySelector(`[data-edit="${key}"]`);
      if (el) el.focus();
    }, 0);
  };
  const saveEditing = () => setEditableField(null);

  const handleSaveTimer = () => {
    alert(
      `Missed chat timer saved: ${settings.missedTimer.h}:${settings.missedTimer.m}:${settings.missedTimer.s}`
    );
  };

  const updateMessage = (index, value) => {
    const updated = [...settings.messages];
    updated[index] = value;
    setSettings((s) => ({ ...s, messages: updated }));
  };

  const updateWelcome = (value) =>
    setSettings((s) => ({ ...s, welcomeMessage: value }));

  // When settings.messages change, rebuild messages so bots remain at top + user messages preserved
  useEffect(() => {
    const userMessages = messages.filter((m) => m.sender === "user");
    const botMessages = settings.messages.map((msg) => ({
      text: msg,
      sender: "bot",
    }));
    setMessages([...botMessages, ...userMessages]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.messages]);

  // Keep settings values in sync with UI
  useEffect(() => {
    const savedHeader = localStorage.getItem("headerColor");
    const savedBg = localStorage.getItem("chatBgColor");
    if (savedHeader || savedBg) {
      setSettings((s) => ({
        ...s,
        headerColor: savedHeader || s.headerColor,
        backgroundColor: savedBg || s.backgroundColor,
      }));
    }
  }, []);

  return (
    <div className="chatbot-container">
      <Sidebar />
      <h1>Chat Bot</h1>
      <div className="left-section">
        <div className="chats-popup" aria-hidden>
          <button className="closes-btn">×</button>
          <img src={logoImage} alt="Chatbot" className="chats-popup-top-img" />
          <p>{settings.welcomeMessage}</p>
        </div>

        <div className="chat-window" aria-live="polite">
          <div
            className="chat-header"
            style={{ backgroundColor: settings.headerColor }}
          >
            <img src={logoImage} alt="Logo" className="chat-logo" />
            <span className="chat-title">Hubly</span>
          </div>

          <div
            className="chats-body"
            ref={chatBodyRef}
            style={{ backgroundColor: settings.backgroundColor }}
          >
            <div className="chats-top-logo">
              <img src={logoImage} alt="bot" className="chats-top-bot-logo" />
            </div>

            <div className="chats-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chats-message ${msg.sender}`}>
                  <span>{msg.text}</span>
                </div>
              ))}

              {showForm && (
                <div className="chats-message bot form-message">
                  <h4>Introduce Yourself</h4>
                  <form onSubmit={handleFormSubmit}>
                    <input
                      type="text"
                      placeholder={settings.formFields.name}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                    <input
                      type="tel"
                      placeholder={settings.formFields.phone}
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      required
                    />
                    <input
                      type="email"
                      placeholder={settings.formFields.email}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                    <button type="submit">Thank You</button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <form className="chats-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="sends-btn" aria-label="send">
              <IoIosSend size={24} />
            </button>
          </form>
        </div>
      </div>

      <div className="right-section">
        {/* Header Color */}
        <div className="setting-card">
          <label className="title">Header Color</label>

          <div className="color-row">
            <button
              type="button"
              className="color white"
              onClick={() => setHeaderColor("#ffffff")}
            />
            <button
              type="button"
              className="color black"
              onClick={() => setHeaderColor("#000000")}
            />
            <button
              type="button"
              className="color blue"
              onClick={() => setHeaderColor("#31475B")}
            />
          </div>

          <div className="preview-row">
            <div
              className="selected-preview"
              style={{ background: settings.headerColor }}
            />
            <input
              type="text"
              readOnly
              value={settings.headerColor}
              className="color-input"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="setting-card">
          <label className="title">Custom Background Color</label>

          <div className="color-row">
            <button
              type="button"
              className="color white"
              onClick={() => setBackgroundColor("#ffffff")}
            />
            <button
              type="button"
              className="color black"
              onClick={() => setBackgroundColor("#000000")}
            />
            <button
              type="button"
              className="color lightgray"
              onClick={() => setBackgroundColor("#EEEEEE")}
            />
          </div>

          <div className="preview-row">
            <div
              className="selected-preview"
              style={{ background: settings.backgroundColor }}
            />
            <input
              type="text"
              readOnly
              value={settings.backgroundColor}
              className="color-input"
            />
          </div>
        </div>

        {/* Customize Messages */}
        <div className="setting-card">
          <label className="title">Customize Message</label>

          {settings.messages.map((m, idx) => (
            <div className="message-edit" key={idx}>
              <input
                data-edit={`msg-${idx}`}
                value={m}
                readOnly={editableField !== `msg-${idx}`}
                onChange={(e) => updateMessage(idx, e.target.value)}
                onBlur={() => saveEditing()}
                onKeyDown={(e) => e.key === "Enter" && saveEditing()}
              />
              <span
                className="edit-icon"
                onClick={() => startEditing(`msg-${idx}`)}
                role="button"
                aria-label={`Edit message ${idx + 1}`}
              >
                🖍
              </span>
            </div>
          ))}
        </div>

        {/* Intro form preview */}
        <div className="setting-card intro-form">
          <label className="title">Introduction Form</label>

          <div className="intro-field">
            <span className="field-label">Your name</span>
            <input
              type="text"
              value={settings.formFields.name}
              readOnly
              className="field-input"
            />
          </div>

          <div className="intro-field">
            <span className="field-label">Your Phone</span>
            <input
              type="text"
              value={settings.formFields.phone}
              readOnly
              className="field-input"
            />
          </div>

          <div className="intro-field">
            <span className="field-label">Your Email</span>
            <input
              type="email"
              value={settings.formFields.email}
              readOnly
              className="field-input"
            />
          </div>

          <button className="intro-btn" onClick={() => alert("Thank you!")}>
            Thank You!
          </button>
        </div>

        {/* Welcome message */}
        <div className="setting-card message">
          <label className="title">Welcome Message</label>
          <div className="welcome-message-edit">
            <textarea
              data-edit="welcome"
              rows={3}
              value={settings.welcomeMessage}
              readOnly={editableField !== "welcome"}
              onChange={(e) => updateWelcome(e.target.value)}
              onBlur={() => saveEditing()}
            />
            <span
              className="edit-icon"
              onClick={() => startEditing("welcome")}
              role="button"
              aria-label="Edit welcome"
            >
              🖍
            </span>
          </div>
        </div>

        {/* Timer settings */}
        <div className="setting-card timer">
          <label className="title">Missed chat timer</label>

          <div className="timer-picker">
            {[hoursRef, minsRef, secsRef].map((ref, i) => (
              <React.Fragment key={i}>
                {i !== 0 && <span className="colon">:</span>}
                <div className="column scroll" ref={ref}>
                  {[...Array(i === 0 ? 24 : 60)].map((_, index) => {
                    const v = String(index).padStart(2, "0");
                    const key = ["h", "m", "s"][i];
                    const selected = v === settings.missedTimer[key];
                    return (
                      <div
                        key={v}
                        className={selected ? "selected" : ""}
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            missedTimer: { ...s.missedTimer, [key]: v },
                          }))
                        }
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>

          <button className="save-btns" onClick={handleSaveTimer}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
