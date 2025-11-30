import mongoose from "mongoose";
import Message from "../models/Message.js";
import Ticket from "../models/Ticket.js";

export const sendMessage = async (req, res) => {
  try {
    const { ticketId, senderId, text } = req.body;

    if (!ticketId || !text) {
      return res.status(400).json({ success: false, message: "ticketId and text required" });
    }

    // verify ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket)
      return res.status(404).json({ success: false, message: "Ticket not found" });

    // create message
    const message = await Message.create({
      ticketId,
      senderId: senderId || null, // null = customer
      text,
    });

    // update ticket status
    await Ticket.findByIdAndUpdate(ticketId, {
      lastMessageAt: Date.now(),
      isMissed: false,
      status: senderId ? "In Progress" : "Open",
    });

    res.json({ success: true, message });
  } catch (err) {
    console.error("sendMessage ERROR:", err);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const id = req.params.ticketId;
    const ticketObjId = new mongoose.Types.ObjectId(id);

    const messages = await Message.find({ ticketId: ticketObjId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, messages });
  } catch (err) {
    console.error("getMessages ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
