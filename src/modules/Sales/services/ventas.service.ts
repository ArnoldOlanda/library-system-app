import { API } from '@/api';
import type { ApiResponse } from '@/interfaces';
import type {
  Venta,
  VentaResponse,
  CreateVentaDto,
  UpdateVentaDto,
} from '../interfaces';

export const ventasService = {
  getAll: async (page: number = 1, limit: number = 10) => {
    const response = await API.get<ApiResponse<VentaResponse>>(
      `/ventas?offset=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await API.get<ApiResponse<Venta>>(`/ventas/${id}`);
    return response.data.data;
  },

  create: async (data: CreateVentaDto) => {
    const response = await API.post<ApiResponse<Venta>>('/ventas', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateVentaDto) => {
    const response = await API.patch<ApiResponse<Venta>>(`/ventas/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await API.delete<ApiResponse<void>>(`/ventas/${id}`);
    return response.data;
  },
};
