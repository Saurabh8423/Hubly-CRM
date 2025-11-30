import React, { useState } from 'react';
import './ChatBotWidget.css';

export default function ChatBotWidget({ icon, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <div className="chatbot-panel">{children}</div>}
      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        {icon}
      </button>
    </>
  );
}
