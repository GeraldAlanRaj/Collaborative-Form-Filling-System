import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const public_instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


export const privateApi = instance;
export const publicApi = public_instance;