import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // ---- EXISTING FIELDS (untouched) ----
    headerColor: { type: String, default: "#4a90e2" },
    backgroundColor: { type: String, default: "#ffffff" },
    initialMessage: { type: String, default: "Hi! How can we help you?" },
    popMessageText: { type: String, default: "Need help? Chat with us!" },
    missedChatTimer: { type: Number, default: 5 },

    // ---- NEW REQUIRED FIELDS (added safely) ----
    supportEmail: { type: String, default: "support@example.com" },
    supportPhone: { type: String, default: "+91-0000000000" },

    botAvatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
    },

    // For chatbot domain security (optional)
    allowedDomains: { type: [String], default: [] },

    // Delay before sending the welcome message
    welcomeDelay: { type: Number, default: 1 }, // in seconds
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
