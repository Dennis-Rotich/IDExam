import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the JWT token to every request.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Replace this with your Zustand store extraction if you aren't using localStorage
    const token = localStorage.getItem('tahini_auth_token'); 
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Globally handles errors, specifically 401s for expired tokens.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API Client] Unauthorized. Token expired or invalid.');
      window.dispatchEvent(new Event("session-expired")); 
    }
    return Promise.reject(error);
  }
);