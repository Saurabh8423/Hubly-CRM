import api from "./api";

// Tickets
export const createTicket = (payload) => api.post("/tickets/create", payload);
export const getTickets = () => api.get("/tickets");

// Messages
export const sendMessageAPI = (payload) => api.post("/messages/send", payload);
export const getMessagesAPI = (ticketId) => api.get(`/messages/${ticketId}`);
