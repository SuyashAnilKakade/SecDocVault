import axios from "axios";

// Backend runs on PORT from .env (default 5000). All routes are mounted under /api/*
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- token storage helpers ----
export const tokenStore = {
  getAccess: () => localStorage.getItem("sdv_access_token"),
  getRefresh: () => localStorage.getItem("sdv_refresh_token"),
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem("sdv_access_token", accessToken);
    if (refreshToken) localStorage.setItem("sdv_refresh_token", refreshToken);
  },
  setUser: (user) => localStorage.setItem("sdv_user", JSON.stringify(user)),
  getUser: () => {
    const raw = localStorage.getItem("sdv_user");
    return raw ? JSON.parse(raw) : null;
  },
  clear: () => {
    localStorage.removeItem("sdv_access_token");
    localStorage.removeItem("sdv_refresh_token");
    localStorage.removeItem("sdv_user");
  },
};

// Attach access token on every request
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401, matching /api/auth/refresh-token contract
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Don't try to refresh on the auth endpoints themselves
    const isAuthRoute = originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStore.getRefresh();

      if (!refreshToken) {
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
          refreshToken,
        });
        const newAccessToken = data.data.accessToken;
        tokenStore.setTokens(newAccessToken, null);
        flushQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Every backend response follows { success, statusCode, message, data }
// This helper extracts the readable error message consistently.
export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

export default api;
