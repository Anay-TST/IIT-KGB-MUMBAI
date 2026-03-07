import axios from 'axios';

// Replace this with the copied address from your Ports tab
const BACKEND_URL = 'https://your-codespace-name-5000.app.github.dev'; 

const api = axios.create({
  baseURL: BACKEND_URL,
});

export default api;
export { BACKEND_URL };