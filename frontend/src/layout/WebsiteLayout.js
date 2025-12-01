import React, { useEffect, useState } from "react";
import Header from "../components/marketing/Header/Header";
import Footer from "../components/marketing/Footer/Footer";
import Landing from "../pages/marketing/Landing/Landing";
import ChatWidget from "../pages/ChatWidget/ChatWidget";

const WebsiteLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 480);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* ==== Header hidden only when mobile & chat open later ==== */}
      {!isMobile && <Header />}

      {/* Landing section hidden only on mobile == true */}
      {!isMobile && <Landing />}

      <main>{children}</main>

      {/* Footer hidden only on mobile */}
      {!isMobile && <Footer />}

      {/* Chat always visible on both desktop & mobile */}
      <ChatWidget mobile={isMobile} />
    </>
  );
};

export default WebsiteLayout;
