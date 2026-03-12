import axios from 'axios';

// Leave this empty! Vite will automatically route it to the backend proxy
export const BACKEND_URL = '';

const api = axios.create({
  baseURL: BACKEND_URL,
});

// --- NEW: THE TOKEN INTERCEPTOR ---
// This acts as a bouncer. Before any request leaves the frontend, 
// it checks for a member token and attaches it to the headers securely.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('memberToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;