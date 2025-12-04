// controllers/ticketController.js
import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/**
 * createTicket
 * Input: { name, email, phone }
 * Creates ticket, returns ticket (with _id)
 */
export const createTicket = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const ticketId = "TKT-" + Date.now();

    const ticket = await Ticket.create({
      ticketId,
      userName: name || "Anonymous",
      userEmail: email || "",
      userPhone: phone || "",
      assignedTo: null,
      lastMessageAt: Date.now(),
    });

    res.json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (err) {
    console.error("createTicket ERROR:", err);
    res.status(500).json({ success: false, message: "Error creating ticket" });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    // optional query params: search, page, limit
    const { search, page = 1, limit = 50 } = req.query;
    const q = {};

    if (search) {
      // search by ticketId or userName (case-insensitive)
      q.$or = [
        { ticketId: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const tickets = await Ticket.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({ path: "assignedTo", select: "_id name email role" });

    // Optionally include last message preview
    const ticketIds = tickets.map((t) => t._id);
    const lastMessages = await Message.aggregate([
      { $match: { ticketId: { $in: ticketIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$ticketId",
          text: { $first: "$text" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    const lastMap = {};
    lastMessages.forEach((lm) => {
      lastMap[lm._id.toString()] = lm;
    });

    const result = tickets.map((t) => {
      const last = lastMap[t._id.toString()] || null;
      return {
        ...t.toObject(),
        lastMessage: last ? { text: last.text, createdAt: last.createdAt } : null,
      };
    });

    res.json({ success: true, tickets: result });
  } catch (err) {
    console.error("getAllTickets ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate({
      path: "assignedTo",
      select: "_id name email role",
    });
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, ticket });
  } catch (err) {
    console.error("getSingleTicket ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * assignTicket
 */
export const assignTicketController = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { toUserId } = req.body;

    // Validate member exists
    const user = await User.findById(toUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update ticket
    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      { assignedTo: toUserId },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Ticket not found" });

    res.json({
      message: "Ticket assigned successfully",
      ticket: updated,
    });
  } catch (err) {
    console.error("Assign Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * updateTicketStatus
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    if (!["Open", "In Progress", "Resolved", "Missed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const ticket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true }).populate({
      path: "assignedTo",
      select: "_id name email role",
    });

    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

    res.json({ success: true, message: "Status updated", ticket });
  } catch (err) {
    console.error("updateTicketStatus ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * dashboardStats - (simple aggregated stats for analytics page)
 */
export const dashboardStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const resolved = await Ticket.countDocuments({ status: "Resolved" });
    const missed = await Ticket.countDocuments({ status: "Missed" });
    const unresolved = await Ticket.countDocuments({ status: { $in: ["Open", "In Progress"] } });

    // average reply time - simplistic: for each ticket find first message time after creation and compute diff
    const tickets = await Ticket.find().select("_id createdAt");
    const replyDiffs = [];

    for (const t of tickets) {
      const firstResponse = await Message.findOne({ ticketId: t._id }).sort({ createdAt: 1 });
      if (firstResponse) {
        // in ms
        const diff = new Date(firstResponse.createdAt).getTime() - new Date(t.createdAt).getTime();
        if (diff >= 0) replyDiffs.push(diff);
      }
    }

    const avgReplyMs = replyDiffs.length ? Math.round(replyDiffs.reduce((a, b) => a + b, 0) / replyDiffs.length) : 0;

    res.json({
      success: true,
      stats: {
        totalChats: total,
        resolvedPercent: total ? Math.round((resolved / total) * 100) : 0,
        missedChats: missed,
        unresolved,
        avgReplyMs: avgReplyMs,
      },
    });
  } catch (err) {
    console.error("dashboardStats ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✔ NEW: Weekly analytics + real avg reply time + real resolved % + real chat count
export const getTicketsAnalytics = async (req, res) => {
  try {
    const tickets = await Ticket.find().lean();
    const messages = await Message.find().sort({ createdAt: 1 }).lean();

    const now = new Date();

    // ----------------------------------------------------
    // 1️⃣ MISSED CHATS – LAST 10 WEEKS (REAL DATA)
    // ----------------------------------------------------
    const missedPerWeek = new Array(10).fill(0);

    tickets.forEach((t) => {
      if (t.status === "Missed") {
        const diffWeeks = Math.floor(
          (now - new Date(t.createdAt)) / (7 * 24 * 60 * 60 * 1000)
        );

        if (diffWeeks >= 0 && diffWeeks < 10) {
          missedPerWeek[9 - diffWeeks]++; // newest on right side
        }
      }
    });

    // ----------------------------------------------------
    // 2️⃣ AVERAGE REPLY TIME (REAL TIME)
    // ----------------------------------------------------
    // We detect: first customer message → first team reply
    const replyTimes = {};

    messages.forEach((msg) => {
      const tid = msg.ticketId.toString();

      // customer message (no senderId)
      if (!msg.senderId) {
        if (!replyTimes[tid]) replyTimes[tid] = { customer: msg.createdAt, team: null };
      }

      // team message (has senderId)
      else {
        if (replyTimes[tid] && !replyTimes[tid].team) {
          replyTimes[tid].team = msg.createdAt;
        }
      }
    });

    const diffs = [];

    Object.values(replyTimes).forEach((r) => {
      if (r.customer && r.team) {
        const diff = new Date(r.team) - new Date(r.customer);
        if (diff > 0) diffs.push(diff);
      }
    });

    const avgReplyMs = diffs.length
      ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length)
      : 0;

    // ----------------------------------------------------
    // 3️⃣ RESOLVED % (REAL DATA)
    // ----------------------------------------------------
    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length;

    const resolvedPercent = totalTickets
      ? Math.round((resolvedTickets / totalTickets) * 100)
      : 0;

    // ----------------------------------------------------
    // 4️⃣ TOTAL CHATS COUNT (customer + team messages)
    // ----------------------------------------------------
    const totalChats = messages.length;

    return res.json({
      missedPerWeek,
      avgReplyMs,
      resolvedPercent,
      totalChats,
    });



  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
