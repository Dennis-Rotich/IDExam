import axios from 'axios';
// Use environment variables for the API URL, fallback to local dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
      // Clear the dead token
      localStorage.removeItem('tahini_auth_token');
      
      // Force the user back to the login screen
      // If using React Router, you might want to use a global event or Zustand state here 
      // instead of a hard window reload, but this guarantees security.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);