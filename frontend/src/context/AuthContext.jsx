import { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import { tokenStore } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate on load: trust local user if a token exists, no need to hit
    // /profile every load since it costs a round trip; profile can refresh lazily.
    setLoading(false);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const loggedInUser = await authService.login({ email, password });
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async ({ fullName, email, password }) => {
    return authService.register({ fullName, email, password });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // even if the server call fails, clear local state
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
