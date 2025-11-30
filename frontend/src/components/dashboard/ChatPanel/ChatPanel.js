import React, { useState } from "react";
import "./ChatPanel.css";

const ChatPanel = ({ messages = [], onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">Support Chat</div>

      <div className="chat-body">
        {messages.length ? (
          messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.from === "user" ? "user" : "agent"}`}>
              {msg.text}
            </div>
          ))
        ) : (
          <div className="no-messages">No messages yet.</div>
        )}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatPanel;
