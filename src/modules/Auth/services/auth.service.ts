import { API } from '@/api/index';
import type { ApiResponse } from '@/interfaces';
import type { LoginDto, LoginResponse, RegisterDto, User } from '../interfaces';

// Servicios
export const authService = {
  login: async (credentials: LoginDto) => {
    const { data } = await API.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterDto) => {
    const { data } = await API.post('/auth/register', userData);
    return data;
  },

  logout: async () => {
    const { data } = await API.post('/auth/logout');
    return data;
  },

  refreshToken: async () => {
    const { data } = await API.post<ApiResponse<LoginResponse>>('/auth/refresh');
    return data;
  },

  getProfile: async () => {
    const { data } = await API.get<User>('/auth/profile');
    return data;
  },

  changePassword: async (passwords: { oldPassword: string; newPassword: string }) => {
    const { data } = await API.patch('/auth/change-password', passwords);
    return data;
  },
};
