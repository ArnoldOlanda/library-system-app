import { API } from '../../../api/index';

// Tipos
export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoriaDto extends Partial<CreateCategoriaDto> {}

// Servicios
export const categoriasService = {
  getAll: async () => {
    const { data } = await API.get<any>('/categorias');
    console.log(data);
    
    return data.data.categorias;
  },

  getById: async (id: string) => {
    const { data } = await API.get<Categoria>(`/categorias/${id}`);
    return data;
  },

  create: async (categoria: CreateCategoriaDto) => {
    const { data } = await API.post<Categoria>('/categorias', categoria);
    return data;
  },

  update: async (id: string, categoria: UpdateCategoriaDto) => {
    const { data } = await API.patch<Categoria>(`/categorias/${id}`, categoria);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await API.delete(`/categorias/${id}`);
    return data;
  },
};
