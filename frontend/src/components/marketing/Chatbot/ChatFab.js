import React from "react";
import chatIcon from "../../../Assets/Floating Action Button.png";
import "./ChatFab.css";

export default function ChatFab({ onClick }) {
  return (
    <button className="hb-fab" onClick={onClick} aria-label="Open chat">
      <img src={chatIcon} alt="chat" />
    </button>
  );
}
