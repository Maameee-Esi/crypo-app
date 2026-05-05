import axios from "axios";

// Central API configuration
// In development: uses http://localhost:5000/api
// In production: set VITE_API_URL in Netlify environment variables
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  },
);

export default API_BASE;
