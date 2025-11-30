import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatMessages, setChatMessages] = useState([]);

  const sendMessage = (msg) => {
    setChatMessages((prev) => [...prev, { from: "user", text: msg }]);

    // Simulated bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { from: "bot", text: "This is an automated reply." }
      ]);
    }, 600);
  };

  return (
    <ChatContext.Provider value={{ chatMessages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
