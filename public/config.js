const API_BASE_URL = "https://jh-notex.vercel.app";

const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  user: {
    me: `${API_BASE_URL}/api/user/me`,
    password: `${API_BASE_URL}/api/user/password`,
  },
  notes: `${API_BASE_URL}/api/notes`,
};
