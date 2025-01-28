import axios from 'axios';

if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is not defined');
}

const BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get token
const getAuthToken = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.warn('No auth token found in sessionStorage');
    return null;
  }
  return token;
};

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enable by default if you're always using cookies/auth
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to automatically add auth token from sessionStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    
    // Debug token presence
    console.log('Token in sessionStorage:', !!token);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request headers:', config.headers);
      console.log('Authorization header set:', config.headers.Authorization);
    } else {
      console.warn('Unable to set Authorization header:', {
        hasToken: !!token,
        hasHeaders: !!config.headers
      });
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });

    if (error.response?.status === 401) {
      console.error('Auth error details:', error.response.data);
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface RequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export const api = {
  get: async (endpoint: string, config?: RequestConfig) => {
    const response = await axiosInstance.get(endpoint, config);
    return response.data;
  },

  post: async (endpoint: string, data: any, config?: RequestConfig) => {
    const response = await axiosInstance.post(endpoint, data, config);
    return response.data;
  },

  put: async (endpoint: string, data: any, config?: RequestConfig) => {
    const response = await axiosInstance.put(endpoint, data, config);
    return response.data;
  },

  delete: async (endpoint: string, config?: RequestConfig) => {
    const response = await axiosInstance.delete(endpoint, config);
    return response.data;
  },
}; 