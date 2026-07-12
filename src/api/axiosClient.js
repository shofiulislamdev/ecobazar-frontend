/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';

// Get base URL from environment or default to server's standard proxy endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically inject JWT Token from local storage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized API Error Handling and Auth Checkers
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Check for standard 401 Unauthorized (Expired or Invalid JWT)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clean up storage and trigger event or state reset
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Optionally redirect to login, or let Context handle state resets
      window.dispatchEvent(new Event('auth-logout'));
    }

    // Capture precise API error message
    const message = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message || 
      'An unexpected error occurred';
      
    return Promise.reject(new Error(message));
  }
);
