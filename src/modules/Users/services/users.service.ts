import type { ApiResponse } from '@/interfaces';
import { API } from '../../../api/index';
import type {
  UserResponse,
  User,
  CreateUserDto,
  UpdateUserDto,
} from '../interfaces';

export const usersService = {
  getAll: async (page?: number, limit?: number, search?: string) => {
    const { data } = await API.get<ApiResponse<UserResponse>>(`/users`, {
      params: {
        offset: page,
        limit,
        search,
      },
    });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await API.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },

  create: async (user: CreateUserDto) => {
    const { data } = await API.post<ApiResponse<User>>('/users', user);
    return data.data;
  },

  update: async (id: string, user: UpdateUserDto) => {
    const { data } = await API.patch<ApiResponse<User>>(`/users/${id}`, user);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await API.delete<any>(`/users/${id}`);
    return data;
  },

  assignRole: async (userId: string, roleId: string) => {
    const { data } = await API.post<ApiResponse<User>>(
      `/users/${userId}/roles`,
      { roleId },
    );
    return data.data;
  },

  removeRole: async (userId: string, roleId: string) => {
    const { data } = await API.delete<ApiResponse<User>>(
      `/users/${userId}/roles`,
      { data: { roleId } },
    );
    return data.data;
  },
};
