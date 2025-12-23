import { API } from '@/api';
import {
  type Cliente,
  type ClienteResponse,
  type CreateClienteDto,
  type UpdateClienteDto,
} from '../interfaces';
import type { ApiResponse } from '@/interfaces';

export const clientesService = {
  getAll: async (page: number = 1, limit: number = 10) => {
    const response = await API.get<ApiResponse<ClienteResponse>>(
      `/clientes?offset=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await API.get<ApiResponse<Cliente>>(`/clientes/${id}`);
    return response.data.data;
  },

  create: async (data: CreateClienteDto) => {
    const response = await API.post<ApiResponse<Cliente>>('/clientes', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateClienteDto) => {
    const response = await API.patch<ApiResponse<Cliente>>(`/clientes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await API.delete<ApiResponse<void>>(`/clientes/${id}`);
    return response.data;
  },
};
