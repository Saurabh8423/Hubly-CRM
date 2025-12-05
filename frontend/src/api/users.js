import api from "./api";

export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (payload) => api.post("/users", payload);
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getCurrentUser = () => api.get("/auth/me");
