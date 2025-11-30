import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WebsiteLayout from "../layout/WebsiteLayout";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../layout/ProtectedRoute";

// Marketing Pages
import Landing from "../pages/marketing/Landing/Landing";
import Login from "../pages/marketing/Login/Login";
import Signup from "../pages/marketing/Signup/Signup";
import FeaturesPage from "../pages/marketing/FeaturesPage/FeaturesPage";
import PricingPage from "../pages/marketing/PricingPage/PricingPage";
import ContactPage from "../pages/marketing/ContactPage/ContactPage";

// Dashboard Pages
import Home from "../pages/dashboard/Home/Home";
import Tickets from "../pages/dashboard/Tickets/Tickets";
import TicketDetails from "../pages/dashboard/TicketDetails/TicketDetails";
import Analytics from "../pages/dashboard/Analytics/Analytics";
import ContactCenter from "../pages/dashboard/ContactCenter/ContactCenter";
import Team from "../pages/dashboard/Team/Team";
import Settings from "../pages/dashboard/Settings/Settings";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 Marketing Website Routes */}
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* 🔐 Dashboard (Protected) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/tickets" element={<Tickets />} />
          <Route path="/dashboard/tickets/:id" element={<TicketDetails />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/contact-center" element={<ContactCenter />} />
          <Route path="/dashboard/team" element={<Team />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
