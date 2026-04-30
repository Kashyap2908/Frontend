import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from './auth';
import { toastService } from './toast';

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url && !config.url.endsWith("/")) {
      config.url += "/";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    const message = error.response?.data?.message ?? 'Something went wrong. Please try again.';
    toastService.error(message);

    return Promise.reject(error);
  }
);

export default api;
