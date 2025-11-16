import { createContext, useContext, useState, useEffect } from 'react';
import {
  saveSession,
  getSession,
  clearSession,
  updateSessionTimestamp,
  hasPermission as checkPermission,
  getUserRole as getRole
} from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session.user);
      setupAutoLogout();
    }
    setLoading(false);
  }, []);

  // Setup auto-logout timer
  const setupAutoLogout = () => {
    // Clear any existing timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    // Set new timeout for 30 minutes
    const timeout = setTimeout(() => {
      logout('Session expired');
    }, 30 * 60 * 1000); // 30 minutes

    setSessionTimeout(timeout);
  };

  // Activity listener to update session timestamp
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      updateSessionTimestamp();
      setupAutoLogout(); // Reset the auto-logout timer
    };

    // Listen for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      saveSession(data.user, data.sessionToken);
      setUser(data.user);
      setupAutoLogout();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = (message) => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    clearSession();
    setUser(null);

    if (message) {
      alert(message);
    }
  };

  const hasPermission = (permission) => {
    return checkPermission(permission);
  };

  const getUserRole = () => {
    return getRole();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    getUserRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
