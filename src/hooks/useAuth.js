/**
 * useAuth — Centralized authentication state hook.
 *
 * Reads from AuthContext (HTTP-only cookie verified server-side).
 * localStorage is NOT used — it was a security vulnerability.
 */
import { useAuthContext } from "../contexts/AuthContext";

const useAuth = () => {
  const { isAdminAuthenticated, authLoading, confirmLogin, logout } = useAuthContext();

  return {
    isAdminAuthenticated,
    authLoading,
    confirmLogin,
    logout,
    // Placeholder for future user auth (not yet implemented)
    isUserAuthenticated: false,
  };
};

export default useAuth;
