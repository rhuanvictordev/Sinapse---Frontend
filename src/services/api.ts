import axios from "axios";

// API local do seu backend
export const LocalAPI = axios.create({
  baseURL: "http://192.168.0.27:8080/api",
});

export const sinapseAPI = axios.create({
  baseURL: "http://localhost:3001",
});

// API pública do Rick and Morty
export const RickAPI = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});

// ===============================
// INTERCEPTOR DE REQUEST (TOKEN)
// ===============================
// Se quiser autenticação com token, descomente isso
// LocalAPI.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//
//   return config;
// });

// ===============================
// INTERCEPTOR DE RESPONSE (DEBUG)
// ===============================


LocalAPI.interceptors.response.use(
  (response) => {
    console.log("AXIOS LOCAL RESPONSE OK", {
      status: response.status,
      url: response.config.url,
    });
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
    console.log("AXIOS SINAPSE RESPONSE OK", {
      status: response.status,
      url: response.config.url,
    });
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