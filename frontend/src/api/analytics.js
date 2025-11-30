import api from "./api";

export const getMetrics = (params) =>
  api.get("/dashboard/metrics", { params });

export const getAvgReplyTime = (params) =>
  api.get("/analytics/avg-reply-time", { params });

export const getResolutionRate = (params) =>
  api.get("/analytics/resolution-rate", { params });
