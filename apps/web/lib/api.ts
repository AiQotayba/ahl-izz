import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://148.230.118.197:3001';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
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

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
      console.error('CORS Error:', error.message);
      return Promise.reject(new Error('لا يمكن الاتصال بالخادم. يرجى المحاولة لاحقاً.'));
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout Error:', error.message);
      return Promise.reject(new Error('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.'));
    }

    // Handle 401 errors (token refresh)
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

    // Handle other HTTP errors
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('خطأ في الخادم. يرجى المحاولة لاحقاً.'));
    }

    if (error.response?.status >= 400) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'حدث خطأ غير متوقع';
      return Promise.reject(new Error(errorMessage));
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

// Health check function
export const checkAPIHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return { status: 'error', message: 'API غير متاح' };
  }
};

export const pledgeAPI = {
  submit: async (pledgeData: any) => {
    try {
      const response = await api.post('/api/pledges', pledgeData);
      return response;
    } catch (error: any) {
      // If API is not available, show a user-friendly message
      if (error.message?.includes('لا يمكن الاتصال بالخادم')) {
        throw new Error('الخادم غير متاح حالياً. يرجى المحاولة لاحقاً أو التواصل معنا عبر وسائل أخرى.');
      }
      throw error;
    }
  },
  
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

