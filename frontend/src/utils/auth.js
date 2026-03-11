const AUTH_KEY = 'kgp_mumbai_admin_session';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 Hours in milliseconds

export const setAdminSession = () => {
  const expiry = new Date().getTime() + SESSION_DURATION;
  localStorage.setItem(AUTH_KEY, JSON.stringify({ authenticated: true, expiry }));
};

export const isAdminAuthenticated = () => {
  const session = localStorage.getItem(AUTH_KEY);
  if (!session) return false;

  const { expiry } = JSON.parse(session);
  if (new Date().getTime() > expiry) {
    localStorage.removeItem(AUTH_KEY); // Session expired
    return false;
  }
  return true;
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
};