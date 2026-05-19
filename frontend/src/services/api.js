import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/signin', { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    return await api.post('/auth/signup', userData);
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
};

export const urlService = {
  shorten: async (urlData) => {
    return await api.post('/urls/shorten', urlData);
  },
  getMyUrls: async () => {
    return await api.get('/urls/my');
  },
  deleteUrl: async (id) => {
    return await api.delete(`/urls/${id}`);
  },
  getAnalytics: async () => {
    return await api.get('/urls/analytics');
  },
  getAllUrls: async () => {
    return await api.get('/urls/admin/all');
  },
};

export default api;
