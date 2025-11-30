// Ticket Status
export const STATUS = {
  NEW: "new",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  CONVERTED: "converted",
};

// User Roles
export const ROLES = {
  ADMIN: "admin",
  AGENT: "agent",
  USER: "user",
};

// API Endpoints (optional)
export const API_ROUTES = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  TICKETS: "/tickets",
  USERS: "/users",
  SETTINGS: "/settings",
};

// Dashboard Navigation Items
export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Tickets", path: "/dashboard/tickets" },
  { label: "Analytics", path: "/dashboard/analytics" },
  { label: "Contact Center", path: "/dashboard/contact-center" },
  { label: "Team", path: "/dashboard/team" },
  { label: "Settings", path: "/dashboard/settings" },
];
