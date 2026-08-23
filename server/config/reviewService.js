import axios from "axios";

const reviewService = axios.create({
  baseURL: process.env.REVIEW_SERVICE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default reviewService;
