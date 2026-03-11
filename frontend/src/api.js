import axios from 'axios';

// Leave this empty! Vite will automatically route it to the backend proxy
export const BACKEND_URL = '';

const api = axios.create({
  baseURL: BACKEND_URL,
});

export default api;