import axios from "axios";

export const Axios = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("_auth");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    config.headers["Content-Type"] = config.data instanceof FormData
      ? "multipart/form-data"
      : "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("_auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);