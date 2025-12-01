import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "https://hubly-crm-backend-skue.onrender.com/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token before requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
