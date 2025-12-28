import type { ApiResponse } from '@/interfaces';
import { API } from '../../../api/index';
import type {
  ProductResponse,
  Producto,
  CreateProductoDto,
  UpdateProductoDto,
} from '../interfaces';

export const productosService = {
  getAll: async (page?: number, limit?: number, search?: string) => {

    const params = new URLSearchParams();
    if (page !== undefined) params.append('offset', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const { data } = await API.get<ApiResponse<ProductResponse>>(
      `/productos?${params.toString()}`
    );
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await API.get<ApiResponse<Producto>>(`/productos/${id}`);
    return data;
  },

  create: async (producto: CreateProductoDto) => {
    const { data } = await API.post<ApiResponse<Producto>>(
      '/productos',
      producto
    );
    return data;
  },

  update: async (id: string, producto: UpdateProductoDto) => {
    const { data } = await API.patch<ApiResponse<Producto>>(
      `/productos/${id}`,
      producto
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await API.delete<any>(`/productos/${id}`);
    return data;
  },
};
