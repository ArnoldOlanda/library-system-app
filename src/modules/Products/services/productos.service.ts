import { API } from '../../../api/index';

// Tipos
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: number;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {}

// Servicios
export const productosService = {
  getAll: async () => {
    const { data } = await API.get<Producto[]>('/productos');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await API.get<Producto>(`/productos/${id}`);
    return data;
  },

  create: async (producto: CreateProductoDto) => {
    const { data } = await API.post<Producto>('/productos', producto);
    return data;
  },

  update: async (id: number, producto: UpdateProductoDto) => {
    const { data } = await API.patch<Producto>(`/productos/${id}`, producto);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await API.delete(`/productos/${id}`);
    return data;
  },
};
