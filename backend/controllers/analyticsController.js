import AnalyticsModel from "../models/AnalyticsModel.js";

import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";

// Add 1 missed chat
// export const addMissedChat = async () => {
//   return await AnalyticsModel.addMissedChat();
// };

// Get analytics data
// export const getAnalytics = async () => {
//   return await AnalyticsModel.getAnalytics();
// };


/**
 *  Missed Chat Rule:
 *  A chat is "missed" if first user message → agent reply > 10 minutes
 * 
 *  Average Reply Time:
 *  For every user → agent reply, count (agentReplyTime – userMessageTime)
 */

export const getAnalytics = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    const messages = await Message.find({}).sort({ createdAt: 1 });

    // ---------- 1. Prepare data structures ----------
    const weekArray = Array(10).fill(0);   // Missed per week
    let totalReplyTime = 0;                // For avg reply time
    let totalReplyCount = 0;               // For avg reply time

    let resolvedCount = 0;
    let totalChats = tickets.length;

    // ---------- 2. Process each ticket ----------
    for (const t of tickets) {
      const ticketMsgs = messages.filter(m => m.ticketId.toString() === t._id.toString());

      if (t.status === "Resolved") resolvedCount++;

      if (!ticketMsgs.length) continue;

      // --- FIND FIRST USER MESSAGE ---
      const firstUserMsg = ticketMsgs.find(m => !m.senderId);
      if (!firstUserMsg) continue;

      // --- FIND FIRST AGENT REPLY ---
      const firstAgentMsg = ticketMsgs.find(m => m.senderId);
      if (!firstAgentMsg) continue;

      const diffMs = new Date(firstAgentMsg.createdAt) - new Date(firstUserMsg.createdAt);

      // ========== MISSED CHAT CALC (10 MIN RULE) ==========
      const TEN_MIN_MS = 10 * 60 * 1000;
      if (diffMs > TEN_MIN_MS) {
        // week distribution → based on ticket creation date
        const weekIndex = Math.min(
          Math.floor((new Date(t.createdAt).getTime() % (10 * TEN_MIN_MS)) / TEN_MIN_MS),
          9
        );
        weekArray[weekIndex] += 1;
      }

      // ========== AVERAGE REPLY TIME ==========
      totalReplyTime += diffMs;
      totalReplyCount++;
    }

    // ---------- FINAL RESULTS ----------
    const avgReplyMs =
      totalReplyCount > 0 ? Math.round(totalReplyTime / totalReplyCount) : 0;

    const resolvedPercent =
      totalChats === 0 ? 0 : Math.round((resolvedCount / totalChats) * 100);

    return res.json({
      success: true,
      missedPerWeek: weekArray,
      avgReplyMs,
      resolvedPercent,
      totalChats,
    });

  } catch (err) {
    console.log("ANALYTICS ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
