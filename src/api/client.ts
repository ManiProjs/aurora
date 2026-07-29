import axios from "axios";

export const api = axios.create({
  timeout: 15000,

  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (axios.isCancel(error)) {
      console.log("Request cancelled");
      return Promise.reject(error);
    }

    if (error.response) {
      console.error("API error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error("No response received:", error.message);
    } else {
      console.error("Request setup failed:", error.message);
    }

    return Promise.reject(error);
  },
);
