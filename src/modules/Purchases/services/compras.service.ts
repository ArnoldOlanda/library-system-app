import { API } from '@/api';
import type { ApiResponse } from '@/interfaces';
import type {
  Compra,
  CompraResponse,
  CreateCompraDto,
} from '../interfaces';

export const comprasService = {
  getAll: async (limit: number = 10, offset: number = 0) => {
    const response = await API.get<ApiResponse<CompraResponse>>(
      `/compras?limit=${limit}&offset=${offset}`
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await API.get<ApiResponse<Compra>>(`/compras/${id}`);
    return response.data.data;
  },

  create: async (data: CreateCompraDto) => {
    const response = await API.post<ApiResponse<Compra>>('/compras', data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await API.delete<ApiResponse<void>>(`/compras/${id}`);
    return response.data;
  },
};
