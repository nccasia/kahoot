import ENV from "@/constants/Environment";
import axios from "axios";
import { getFromLocalStorage } from "../localStorage";
const baseURL = ENV.BACKEND_URL;

const axiosConfig = axios.create({
  baseURL: `${baseURL}/v1`,
  headers: {
    "Content-Type": "application/json",
    "Bypass-Tunnel-Reminder": "true",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
});

axiosConfig.interceptors.request.use((config) => {
  const accessToken = getFromLocalStorage("accessToken");
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
      console.log("Unauthorized");
      // window.location.href = ROUTES.HOME;
    }
    return await Promise.reject(error);
  }
);
export default axiosConfig;
