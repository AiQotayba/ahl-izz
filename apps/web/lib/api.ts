import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/api/auth/refresh');
        const { accessToken } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  refresh: () =>
    api.post('/api/auth/refresh'),
  
  logout: () =>
    api.post('/api/auth/logout'),
};

export const pledgeAPI = {
  submit: (pledgeData: any) =>
    api.post('/api/pledges', pledgeData),
  
  getPublic: (limit = 50) =>
    api.get(`/api/pledges/public?limit=${limit}`),
  
  getStats: () =>
    api.get('/api/pledges/stats'),
  
  getAll: (params?: any) =>
    api.get('/api/pledges', { params }),
  
  getById: (id: string) =>
    api.get(`/api/pledges/${id}`),
  
  update: (id: string, data: any) =>
    api.put(`/api/pledges/${id}`, data),
  
  erasePII: (id: string) =>
    api.delete(`/api/pledges/${id}/erase`),
};

export default api;

