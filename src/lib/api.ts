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

interface ApiResponse<T = any> {
  data: T;
}

export const api = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, config);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: JSON.stringify(data),
      ...config,
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  delete: async (url: string, config?: any): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      method: 'DELETE',
      ...config,
    });
    if (!response.ok) throw new Error('API Error');
  },
}; 