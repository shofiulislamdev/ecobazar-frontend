/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);

    // Synchronize logout across multiple tabs and custom events
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  // Login: POST /login
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/login', credentials);
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register: POST /registration
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/registration', userData);
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return receivedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // Forgot Password: POST /forgotpassword
  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post('/forgotpassword', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Reset Password: POST /resetpassword/:token
  const resetPassword = async (resetToken, data) => {
    try {
      const response = await axiosInstance.post(`/resetpassword/${resetToken}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Verify Email: POST /verifyemail/:token
  const verifyEmail = async (verifyToken) => {
    try {
      const response = await axiosInstance.post(`/verifyemail/${verifyToken}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Resend Verification Email: POST /resendverificationemail
  const resendVerification = async (email) => {
    try {
      const response = await axiosInstance.post('/resendverificationemail', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
