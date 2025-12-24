import { API } from '@/api';
import {
  type Caja,
  type CajaResponse,
  type CreateCajaDto,
  type UpdateCajaDto,
} from '../interfaces';
import type { ApiResponse } from '@/interfaces';

export const cajaService = {
  getAll: async (page: number = 1, limit: number = 10) => {
    const response = await API.get<ApiResponse<CajaResponse>>(
      `/arqueos-caja?offset=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await API.get<ApiResponse<Caja>>(`/arqueos-caja/${id}`);
    return response.data.data;
  },

  getOpenCaja: async () => {
    const response = await API.get<ApiResponse<Caja>>('/arqueos-caja/open/today');
    return response.data.data;
  },


  create: async (data: CreateCajaDto) => {
    const response = await API.post<ApiResponse<Caja>>('/arqueos-caja', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateCajaDto) => {
    const response = await API.patch<ApiResponse<Caja>>(`/arqueos-caja/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await API.delete<ApiResponse<void>>(`/arqueos-caja/${id}`);
    return response.data;
  },
};
