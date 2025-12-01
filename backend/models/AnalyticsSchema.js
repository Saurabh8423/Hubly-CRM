import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  missedPerWeek: {
    type: [Number],
    default: Array(10).fill(0), // Week1–Week10
  },
});

export default mongoose.model("Analytics", AnalyticsSchema);
