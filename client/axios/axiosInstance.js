import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      config.headers["x-user-id"] = uid;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
