import axios from 'axios';

// We trim any trailing slash from the URL to prevent "https://site.com//api" errors
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const cleanUrl = rawUrl.replace(/\/$/, ""); 

/**
 * By adding /api here, you don't have to type it in every component.
 * Your images will still use cleanUrl + '/uploads/...'
 */
export const BACKEND_URL = cleanUrl;
export const API_URL = `${cleanUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('memberToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Redirecting to login...");
      // Optional: localStorage.removeItem('memberToken');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
