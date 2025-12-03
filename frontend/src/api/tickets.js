import api from "./api";
import axios from "axios";
const API = "https://hubly-crm-backend-skue.onrender.com/api/tickets";

export const createTicket = (payload) => api.post("/tickets/create", payload);
export const getTickets = (params) => api.get("/tickets", { params });
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const assignTicket = (ticketId, userId) => {
  return axios.put(`${API}/assign/${ticketId}`, { toUserId: userId });
};
export const updateTicketStatus = (ticketId, status) => api.put(`/tickets/status/${ticketId}`, { status });
export const getTicketsWithMessages = async () => {
  return await api.get("/tickets/withMessages");
};
export const getTicketsAnalytics = () => api.get("/tickets/analytics");


