import axios from 'axios';

// Get this from the "Ports" tab -> Port 5000 -> Forwarded Address
export const BACKEND_URL = 'https://animated-space-couscous-v6p9p9gvvvr6fp7w-5000.app.github.dev';

const api = axios.create({
  baseURL: BACKEND_URL,
});

export default api;