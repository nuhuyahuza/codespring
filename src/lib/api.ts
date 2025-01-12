import axios from 'axios';

const BASE_URL = '/api';

export const api = {
  get: async (endpoint: string, token?: string) => {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  post: async (endpoint: string, data: any, token?: string) => {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  put: async (endpoint: string, data: any, token?: string) => {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  delete: async (endpoint: string, token?: string) => {
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },
}; 