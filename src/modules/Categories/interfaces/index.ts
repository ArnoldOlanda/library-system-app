import type { Pagination } from "@/interfaces";

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse extends Pagination{
  categorias: Categoria[];
} 

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoriaDto extends Partial<CreateCategoriaDto> {}