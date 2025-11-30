import API  from "./api"; 

export const getUsers = () => API.get("/users"); // GET /api/users
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (payload) => API.post("/users", payload);
export const updateUser = (id, payload) => API.put(`/users/${id}`, payload);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// optional: fetch current user if your backend exposes it
export const getCurrentUser = () => API.get("/auth/me");