import type { ApiResponse } from '@/interfaces';
import { API } from '../../../api/index';
import type {
  ProductResponse,
  Producto,
  CreateProductoDto,
  UpdateProductoDto,
} from '../interfaces';

export const productosService = {
  getAll: async (page: number = 1, limit: number = 10) => {
    const { data } = await API.get<ApiResponse<ProductResponse>>(
      `/productos?offset=${page}&limit=${limit}`
    );
    return data.data.productos;
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
