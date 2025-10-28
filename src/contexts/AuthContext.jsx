import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tokenService } from '../services/api';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      const savedUser = tokenService.getUser();

      if (token && savedUser) {
        // Verify token is still valid
        try {
          const response = await authAPI.getMe();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          console.error('Token validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        tokenService.setToken(response.token);
        tokenService.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.'
      };
    }
  };

  // Google Login function
  const googleLogin = async (credential) => {
    try {
      const response = await authAPI.googleLogin(credential);

      if (response.success) {
        tokenService.setToken(response.token);
        tokenService.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Google login failed. Please try again.'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.success) {
        tokenService.setToken(response.token);
        tokenService.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = () => {
    tokenService.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user details
  const updateUser = async (userData) => {
    try {
      const response = await authAPI.updateDetails(userData);

      if (response.success) {
        setUser(response.data);
        tokenService.setUser(response.data);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Update failed. Please try again.'
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword(currentPassword, newPassword);

      if (response.success) {
        return { success: true, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password change failed. Please try again.'
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    googleLogin,
    register,
    logout,
    updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
