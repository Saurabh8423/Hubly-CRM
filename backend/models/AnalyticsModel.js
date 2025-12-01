import Analytics from "./AnalyticsSchema.js";

export default {
  addMissedChat: async () => {
    let data = await Analytics.findOne();
    if (!data) {
      data = await Analytics.create({
        missedPerWeek: Array(10).fill(0),
      });
    }

    // Always increase Week-1
    data.missedPerWeek[0] += 1;
    await data.save();
  },

  getAnalytics: async () => {
    let data = await Analytics.findOne();
    if (!data) {
      data = await Analytics.create({
        missedPerWeek: Array(10).fill(0),
      });
    }
    return data;
  },
};
