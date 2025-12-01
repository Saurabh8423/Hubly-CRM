import api from "./api";

// Main analytics API (required by your Analytics.js)
export const getAnalytics = () => api.get("/tickets/analytics");

// Dashboard metrics (summary cards)
export const getMetrics = (params) =>
  api.get("/dashboard/metrics", { params });

// Average reply time
export const getAvgReplyTime = (params) =>
  api.get("/analytics/avg-reply-time", { params });

// Ticket resolution rate
export const getResolutionRate = (params) =>
  api.get("/analytics/resolution-rate", { params });
