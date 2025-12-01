import AnalyticsModel from "../models/AnalyticsModel.js";

// Add 1 missed chat
export const addMissedChat = async () => {
  return await AnalyticsModel.addMissedChat();
};

// Get analytics data
export const getAnalytics = async () => {
  return await AnalyticsModel.getAnalytics();
};
