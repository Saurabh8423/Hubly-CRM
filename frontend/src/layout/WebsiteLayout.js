import React from "react";
import Header from "../components/marketing/Header/Header";
import Footer from "../components/marketing/Footer/Footer";
import Landing from "../pages/marketing/Landing/Landing";
import ChatWidget from "../pages/ChatWidget/ChatWidget";


const WebsiteLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Landing />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
};

export default WebsiteLayout;
