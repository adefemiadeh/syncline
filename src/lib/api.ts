// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://your-backend-url/api", // Change this later when backend is running
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token interceptor later
api.interceptors.request.use((config) => {
  // const token = get token from secure storage
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
