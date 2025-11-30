import cron from "node-cron";
import Ticket from "../models/Ticket.js";
import Settings from "../models/Settings.js";
import mongoose from "mongoose";


// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    // read missed timer from settings (ms)
    const doc = await Settings.findOne({ key: "global" }).lean();
    const missedTimerMs = doc?.value?.missedTimerMs ?? 10 * 60 * 1000; // default 10 min


    const now = Date.now();
    const tickets = await Ticket.find({ isMissed: false });


    for (const t of tickets) {
      const last = new Date(t.lastMessageAt).getTime();
      const diff = now - last;
      if (diff > missedTimerMs) {
        await Ticket.findByIdAndUpdate(t._id, { isMissed: true, status: "Missed" });
        console.log(`Ticket ${t.ticketId} marked MISSED`);
      }
    }
  } catch (err) {
    console.error("CRON ERROR:", err);
  }
});