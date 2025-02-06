import axios from "axios";
import ENV from "@/constants/Environment";
import { getCookie } from "../cookies";
const baseURL = ENV.BACKEND_URL;

const axiosConfig = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosConfig.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken !== undefined) {
    config.headers.Authorization = "Bearer " + String(accessToken);
  }
  return config;
});

axiosConfig.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return await Promise.reject(error);
  }
);
export default axiosConfig;
