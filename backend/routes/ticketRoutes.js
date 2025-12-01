import express from "express";
import {
  createTicket,
  getAllTickets,
  getSingleTicket,
  assignTicket,
  updateTicketStatus,
  getTicketsAnalytics,
} from "../controllers/ticketController.js";

import {
  addMissedChat,
  getAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// ----------------------
// IMPORTANT: Analytics FIRST!
// ----------------------
router.get("/analytics", getTicketsAnalytics);

// Other ticket routes
router.post("/create", createTicket);
router.get("/", getAllTickets);
router.put("/:ticketId/assign", assignTicket);
router.put("/status/:id", updateTicketStatus);
router.get("/:id", getSingleTicket);

// --------------------------
// MISSED CHAT ROUTE
// --------------------------
router.post("/missed", async (req, res) => {
  try {
    await addMissedChat();
    return res.json({ success: true });
  } catch (err) {
    console.log("Missed chat save error", err);
    return res.status(500).json({ success: false });
  }
});

// --------------------------
// ANALYTICS ROUTE
// --------------------------
router.get("/analytics", async (req, res) => {
  try {
    const analytics = await getAnalytics();
    return res.json({ analytics });
  } catch (err) {
    console.log("Analytics error", err);
    return res.status(500).json({ analytics: null });
  }
});

export default router;
