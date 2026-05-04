import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3001/"
      : "/server/", 
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

export default api;
