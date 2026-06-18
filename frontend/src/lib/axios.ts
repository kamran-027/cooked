import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/user/login");
    if (error.response && error.response.status === 401 && !isAuthRequest) {
      sessionStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:logout"));
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export default api;
