// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // true while verifying cookie on mount

  /**
   * Verify session by calling GET /api/admin/me.
   * The HTTP-only cookie is sent automatically by the browser (credentials:'include').
   * JS never reads or stores the token — that's the whole point.
   */
  const verifySession = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/me`, {
        method: "GET",
        credentials: "include", // send the HTTP-only cookie cross-origin
      });
      setIsAdminAuthenticated(res.ok);
    } catch {
      setIsAdminAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Only verify the admin session when the user is actually on an /admin route.
  // On public pages there is no adminToken cookie, so the check would always
  // return 401 — which the browser logs to the console as a network error.
  // Lighthouse "Browser errors logged to console" penalises this heavily.
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      verifySession();
    } else {
      // Not an admin route: skip the request and mark loading as done immediately.
      setAuthLoading(false);
    }
  }, [verifySession]);

  /**
   * Call after a successful login response from the server.
   * The cookie is already set by the server — we just update local state.
   */
  const confirmLogin = () => setIsAdminAuthenticated(true);

  /**
   * Logout — tells the server to clear the HTTP-only cookie,
   * then updates local state so the router redirects to /admin/login.
   */
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Even if the request fails, clear state so UI reflects logged-out
    } finally {
      setIsAdminAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAdminAuthenticated, authLoading, confirmLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
};
