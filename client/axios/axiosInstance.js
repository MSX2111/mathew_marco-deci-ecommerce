import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically intercept every outgoing request and attach the user ID header
api.interceptors.request.use(
  (config) => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      config.headers["x-user-id"] = uid; // Inject user ID dynamically from localStorage
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
