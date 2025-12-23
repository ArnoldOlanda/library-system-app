import { API } from '@/api';
import {
  type Proveedor,
  type ProveedorResponse,
  type CreateProveedorDto,
  type UpdateProveedorDto,
} from '../interfaces';
import type { ApiResponse } from '@/interfaces';

export const proveedoresService = {
  getAll: async (page: number = 1, limit: number = 10) => {
    const response = await API.get<ApiResponse<ProveedorResponse>>(
      `/proveedores?offset=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await API.get<ApiResponse<Proveedor>>(`/proveedores/${id}`);
    return response.data.data;
  },

  create: async (data: CreateProveedorDto) => {
    const response = await API.post<ApiResponse<Proveedor>>('/proveedores', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateProveedorDto) => {
    const response = await API.patch<ApiResponse<Proveedor>>(`/proveedores/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await API.delete<ApiResponse<void>>(`/proveedores/${id}`);
    return response.data;
  },
};
