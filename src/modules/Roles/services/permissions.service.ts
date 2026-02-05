import type { ApiResponse } from '@/interfaces';
import { API } from '../../../api/index';
import type { Permission } from '../interfaces';

export const permissionsService = {
  getAll: async () => {
    const { data } = await API.get<ApiResponse<Permission[]>>('/permissions');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await API.get<ApiResponse<Permission>>(`/permissions/${id}`);
    return data.data;
  },
};
