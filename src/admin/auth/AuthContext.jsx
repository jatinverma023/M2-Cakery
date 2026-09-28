import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredToken, setStoredToken, removeStoredToken } from '../api/client';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setAdmin(null);
    setError(null);
  }, []);

  // Verify session on mount if token exists
  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const stored = getStoredToken();
      if (!stored) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response?.data?.admin) {
          setAdmin(response.data.admin);
          setToken(stored);
        }
      } catch (err) {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifySession();

    // Listen for global 401 unauthorized events from api client
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('m2_auth_unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('m2_auth_unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login(email, password);
      const { token: receivedToken, admin: adminData } = response.data;
      setStoredToken(receivedToken);
      setToken(receivedToken);
      setAdmin(adminData);
      return adminData;
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    }
  };

  const value = {
    admin,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: Boolean(token && admin),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
