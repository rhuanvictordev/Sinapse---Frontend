import axios from "axios";
import "dotenv/config";

export const sinapseAPI = axios.create({
  baseURL: "/sinapse"
});

sinapseAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

sinapseAPI.interceptors.response.use(
  (response) => {
    console.log({status: response.status,url: response.config.url,});
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("AXIOS SINAPSE RESPONSE ERROR:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else {
      console.log("AXIOS SINAPSE NETWORK ERROR:", error.message);
    }
    return Promise.reject(error);
  }
);