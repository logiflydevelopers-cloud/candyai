import axios from "axios";

const API = axios.create({
  baseURL: "https://candyai.onrender.com/api",
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

      const url = err.config?.url;

      // 🔥 IGNORE my-plan 401 silently
      if (url?.includes("/plans/my-plan")) {
        console.log("Ignore 401 from my-plan");

        return Promise.resolve({
          data: {
            active: false,
            plan: null
          }
        });
      }

      // ❌ real auth fail → logout
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("openLogin"));
    }

    return Promise.reject(err);
  }
);

export default API;
