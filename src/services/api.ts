import axios from "axios";
import "dotenv/config";

export const LocalAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL
});

export const sinapseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND
});

export const RickAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RICK
});

sinapseAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

LocalAPI.interceptors.response.use(
  (response) => {
    console.log({status: response.status,url: response.config.url,});
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("AXIOS LOCAL RESPONSE ERROR:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else {
      console.log("AXIOS LOCAL NETWORK ERROR:", error.message);
    }
    return Promise.reject(error);
  }
);


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


RickAPI.interceptors.response.use(
  (response) => {
    console.log("AXIOS RICK RESPONSE OK:", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("AXIOS RICK RESPONSE ERROR:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else {
      console.log("AXIOS RICK NETWORK ERROR:", error.message);
    }
    return Promise.reject(error);
  }
);