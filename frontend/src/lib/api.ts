import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://vhlafnxhkalzwzlcbidq.supabase.co/functions/v1/paisaads-api";

const api = axios.create({
  baseURL: API_BASE + "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests from localStorage
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("paisaads_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Store token on login responses
api.interceptors.response.use((response) => {
  if (response.data?.token && typeof window !== "undefined") {
    localStorage.setItem("paisaads_token", response.data.token);
  }
  return response;
});

export default api;
