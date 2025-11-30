import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import WebsiteLayout from "./layout/WebsiteLayout";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./layout/ProtectedRoute";

// Marketing Pages
import Landing from "./pages/marketing/Landing/Landing";

// Auth Pages
import Login from "./pages/marketing/Auth/Login";
import Signup from "./pages/marketing/Auth/Signup";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Home/Dashboard";
import Tickets from "./pages/dashboard/Tickets/Tickets";
import Analytics from "./pages/dashboard/Analytics/Analytics";
import ContactCenter from "./pages/dashboard/ContactCenter/ContactCenter";
import Team from "./pages/dashboard/Team/Team";
import Settings from "./pages/dashboard/Settings/Settings";
import Chatbot from "./pages/dashboard/Chatbot/Chatbot";

function App() {
  return (
    <Routes>

      {/* -------- Marketing Routes (with header + footer) -------- */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* -------- Auth Routes (NO header/footer) -------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* -------- Dashboard Routes (Protected) -------- */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/tickets" element={<Tickets />} />
        <Route path="/dashboard/contact-center" element={<ContactCenter />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/chatbot" element={<Chatbot />} />
        <Route path="/dashboard/team" element={<Team />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
