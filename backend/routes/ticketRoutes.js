import express from "express";
import {
  createTicket,
  getAllTickets,
  getSingleTicket,
  assignTicketController,
  updateTicketStatus
} from "../controllers/ticketController.js";

import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// ----------------------
// MAIN ANALYTICS
// ----------------------
router.get("/analytics", getAnalytics);

// --------------------------
// TICKET ROUTES
// --------------------------
router.post("/create", createTicket);
router.get("/", getAllTickets);
router.put("/assign/:ticketId", assignTicketController);
router.put("/status/:id", updateTicketStatus);
router.get("/:id", getSingleTicket);

export default router;
