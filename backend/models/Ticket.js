import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },

    userName: String,
    userEmail: String,
    userPhone: String,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Missed"],
      default: "Open",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    isMissed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
