import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refreshToken }),
  logoutAll: () => api.post('/auth/logout-all'),
  changePassword: (data: any) => api.post('/auth/change-password', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  setup2FA: () => api.post('/auth/2fa/setup'),
  verify2FA: (token: string) => api.post('/auth/2fa/verify', { token }),
  disable2FA: (token: string) => api.post('/auth/2fa/disable', { token }),
  setPin: (pin: string) => api.post('/auth/pin/set', { pin }),
  changePin: (currentPin: string, newPin: string) => api.post('/auth/pin/change', { currentPin, newPin }),
  verifyPin: (pin: string) => api.post('/auth/pin/verify', { pin }),
};

// User API
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getSessions: () => api.get('/users/sessions'),
  getDashboard: () => api.get('/users/dashboard'),
};

// Wallet API
export const walletApi = {
  getBalance: () => api.get('/wallets/balance'),
  getTransactions: (params?: any) => api.get('/wallets/transactions', { params }),
  getAddresses: () => api.get('/wallets/addresses'),
  generateAddress: (chain: string) => api.post(`/wallets/addresses/${chain}`),
};

// Deposit API
export const depositApi = {
  getDeposits: () => api.get('/deposits'),
  createDeposit: (data: any) => api.post('/deposits', data),
};

// Withdrawal API
export const withdrawalApi = {
  getWithdrawals: () => api.get('/withdrawals'),
  requestWithdrawal: (data: any) => api.post('/withdrawals', data),
};

// Quantization API
export const quantizationApi = {
  start: () => api.post('/quantization/start'),
  getStatus: () => api.get('/quantization/status'),
};

// Referral API
export const referralApi = {
  getTeam: () => api.get('/referral/team'),
  getRewards: () => api.get('/referral/rewards'),
  getTree: () => api.get('/referral/tree'),
};

// Levels API
export const levelsApi = {
  getAll: () => api.get('/levels'),
  getMyLevel: () => api.get('/levels/my-level'),
  checkUpgrade: () => api.get('/levels/check-upgrade'),
  upgrade: () => api.post('/levels/upgrade'),
};

// Notifications API
export const notificationsApi = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Admin API
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserDetail: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: string) => api.put(`/admin/users/${id}/status`, { status }),
  getPendingWithdrawals: () => api.get('/admin/withdrawals/pending'),
  approveWithdrawal: (id: string, adminId: string) => api.post(`/admin/withdrawals/${id}/approve`, { adminId }),
  completeWithdrawal: (id: string, txHash: string) => api.post(`/admin/withdrawals/${id}/complete`, { txHash }),
  rejectWithdrawal: (id: string, reason: string) => api.post(`/admin/withdrawals/${id}/reject`, { reason }),
  getStats: () => api.get('/admin/stats'),
  getAuditLogs: (params?: any) => api.get('/admin/audit-logs', { params }),
};
