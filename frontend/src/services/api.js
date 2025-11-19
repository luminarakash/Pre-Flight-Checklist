import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL: BASE });

// endpoints
export const createChecklist = (data) => api.post("/checklists", data);
export const getChecklists = () => api.get("/checklists");
export const deleteChecklist = (id) => api.delete(`/checklists/${id}`);
export const updateChecklist = (id, data) => api.put(`/checklists/${id}`, data);
export const getChecklist = (id) => api.get(`/checklists/${id}`);
