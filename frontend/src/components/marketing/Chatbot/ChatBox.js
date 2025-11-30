import React, { useState } from "react";
import API from "../../../api/api";
import "./ChatBox.css";

function ChatBox({ close }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitChat = async () => {
    try {
      await API.post("/tickets/create", {
        ...form,
        initialMessage: "User submitted chat form"
      });
      setSubmitted(true);
    } catch (err) {
      console.error("chat submit error", err);
      alert("Unable to send. Try again.");
    }
  };

  return (
    <div className="chatbox">
      <div className="header">
        <div className="title">Hubly</div>
        <button className="close" onClick={close}>✕</button>
      </div>

      {!submitted ? (
        <div className="form-section">
          <div className="intro">Want to chat about Hubly? I'm an chatbot here to help you find your way.</div>
          <input name="name" placeholder="Your Name" onChange={change} />
          <input name="email" placeholder="Email" onChange={change} />
          <input name="phone" placeholder="Phone" onChange={change} />
          <button className="submit-btn" onClick={submitChat}>Thank You</button>
        </div>
      ) : (
        <div className="thanks">
          <h4>Thanks!</h4>
          <p>Our team will reach out to you soon.</p>
          <button onClick={close} className="close-btn">Close</button>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
