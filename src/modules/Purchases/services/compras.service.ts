import { API } from '@/api';
import type { ApiResponse } from '@/interfaces';
import type {
  Compra,
  CompraResponse,
  CreateCompraDto,
} from '../interfaces';

export const comprasService = {
  getAll: async (offset?: number, limit?: number, search?: string) => {
    
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());
    if (search) params.append('search', search);

    const {data} = await API.get<ApiResponse<CompraResponse>>(
      `/compras?${params.toString()}`
    );
    
    return data.data;
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
