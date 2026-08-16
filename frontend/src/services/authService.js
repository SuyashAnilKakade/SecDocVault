import api, { tokenStore } from "./api";

// POST /api/auth/register  { fullName, email, password } -> 201
const register = async ({ fullName, email, password }) => {
  const { data } = await api.post("/auth/register", { fullName, email, password });
  return data.data; // { id, fullName, email, role }
};

// POST /api/auth/login  { email, password } -> { accessToken, refreshToken, user }
const login = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  const { accessToken, refreshToken, user } = data.data;
  tokenStore.setTokens(accessToken, refreshToken);
  tokenStore.setUser(user);
  return user;
};

// POST /api/auth/logout (auth required)
const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    tokenStore.clear();
  }
};

// POST /api/auth/forgot-password { email }
const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data.message;
};

// POST /api/auth/reset-password { token, password }
const resetPassword = async ({ token, password }) => {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data.message;
};

// GET /api/auth/profile (auth required)
const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data.user;
};

const getCurrentUser = () => tokenStore.getUser();
const isAuthenticated = () => Boolean(tokenStore.getAccess());

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  getCurrentUser,
  isAuthenticated,
};

export default authService;
