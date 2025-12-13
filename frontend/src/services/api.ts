import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.15.173:3000/api", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;