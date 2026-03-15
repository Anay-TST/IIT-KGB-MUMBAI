import axios from 'axios';

/**
 * BACKEND_URL logic:
 * 1. In Production (Vercel): Uses the URL you just set in Environment Variables.
 * 2. In Local Dev: Falls back to your local Node server port.
 */
export const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BACKEND_URL,
});

// Request Interceptor: Automatically attaches the login token to every API call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('memberToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Helpful for catching global errors (like an expired session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says 'Unauthorized', you could trigger a logout here
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
