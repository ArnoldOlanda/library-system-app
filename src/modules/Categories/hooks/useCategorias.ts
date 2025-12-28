import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '@/modules/Categories/services/categorias.service';
import type { CreateCategoriaDto, UpdateCategoriaDto } from '../interfaces';

const QUERY_KEY = 'categorias';

// Hooks para queries (GET)
export function useCategorias(page?: number, limit?: number, search?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit, search],
    queryFn: () => categoriasService.getAll(page, limit, search),
  });
}

export function useCategoria(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => categoriasService.getById(id),
    enabled: !!id, // Solo ejecutar si hay id
  });
}

// Hooks para mutaciones (POST, PUT, DELETE)
export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoria: CreateCategoriaDto) => categoriasService.create(categoria),
    onSuccess: () => {
      // Invalida y refetch la lista de categorías
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoriaDto }) => 
      categoriasService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
