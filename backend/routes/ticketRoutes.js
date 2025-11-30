import express from "express";
import {
  createTicket,
  getAllTickets,
  getSingleTicket,
  assignTicket,
  updateTicketStatus,
  dashboardStats,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/create", createTicket);
router.get("/", getAllTickets);
router.get("/stats", dashboardStats); // analytics
router.get("/:id", getSingleTicket);
router.put("/:ticketId/assign", assignTicket);
router.put("/status/:id", updateTicketStatus);

export default router;
