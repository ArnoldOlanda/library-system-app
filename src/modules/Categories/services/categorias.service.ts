import type { ApiResponse } from '@/interfaces';
import { API } from '../../../api/index';
import type { CategoryResponse, Categoria, CreateCategoriaDto, UpdateCategoriaDto } from '../interfaces';

export const categoriasService = {
  getAll: async (page?: number, limit?: number, search?: string) => {

    const params = new URLSearchParams();
    if (page !== undefined) {
      params.append('offset', page.toString());
    }
    if (limit !== undefined) {
      params.append('limit', limit.toString());
    }
    if (search) {
      params.append('search', search);
    }

    const { data } = await API.get<ApiResponse<CategoryResponse>>(`/categorias?${params.toString()}`);

    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await API.get<ApiResponse<Categoria>>(`/categorias/${id}`);
    return data;
  },

  create: async (categoria: CreateCategoriaDto) => {
    const { data } = await API.post<ApiResponse<Categoria>>('/categorias', categoria);
    return data;
  },

  update: async (id: string, categoria: UpdateCategoriaDto) => {
    const { data } = await API.patch<ApiResponse<Categoria>>(`/categorias/${id}`, categoria);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await API.delete<any>(`/categorias/${id}`);
    return data;
  },
};
