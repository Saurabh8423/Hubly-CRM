import React, { useState } from "react";


// Sections
import Hero from "../../../components/marketing/Hero/Hero";
import Features from "../../../components/marketing/Features/Features";
import Pricing from "../../../components/marketing/Pricing/Pricing";

// Chatbot
import ChatFab from "../../../components/marketing/Chatbot/ChatFab";
import ChatBox from "../../../components/marketing/Chatbot/ChatBox";

export default function Landing() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>

      {/* Sections */}
      <Hero />
      <Features />
      <Pricing />

      {/* Chatbot */}
      <ChatFab onClick={() => setChatOpen((s) => !s)} />
      {chatOpen && <ChatBox close={() => setChatOpen(false)} />}
    </>
  );
}
