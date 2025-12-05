import express from "express";
import {
  createTicket,
  getAllTickets,
  getSingleTicket,
  assignTicketController,
  updateTicketStatus,
  getTicketsAnalytics
} from "../controllers/ticketController.js";

const router = express.Router();

// Analytics Route
router.get("/analytics", getTicketsAnalytics);

// Ticket Routes
router.post("/create", createTicket);
router.get("/", getAllTickets);
router.put("/assign/:ticketId", assignTicketController);
router.put("/status/:id", updateTicketStatus);
router.get("/:id", getSingleTicket);

export default router;
