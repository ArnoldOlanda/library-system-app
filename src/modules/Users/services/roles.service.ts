import type { ApiResponse } from '@/interfaces';
import { API } from '../../../api/index';
import type { Role } from '../interfaces';

export const rolesService = {
  getAll: async () => {
    const { data } = await API.get<ApiResponse<Role[]>>('/roles');
    return data.data;
  },
};
