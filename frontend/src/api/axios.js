import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor (optional but recommended)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (AUTO LOGOUT IF 401)
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");

      // 🔥 React friendly redirect
      window.dispatchEvent(new Event("openLogin"));

      // ❗ DO NOT hard redirect
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
