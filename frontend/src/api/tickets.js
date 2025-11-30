import api from "./api";

export const createTicket = (payload) => api.post("/tickets/create", payload);
export const getTickets = (params) => api.get("/tickets", { params });
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const assignTicket = (ticketId, assignedTo) => api.put(`/tickets/assign/${ticketId}`, { assignedTo });
export const updateTicketStatus = (ticketId, status) => api.put(`/tickets/status/${ticketId}`, { status });
