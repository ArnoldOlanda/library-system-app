import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '@/modules/Categories/services/categorias.service';
import type { CreateCategoriaDto, UpdateCategoriaDto } from '../interfaces';

// Query Keys
export const categoriasKeys = {
  all: ['categorias'] as const,
  lists: () => [...categoriasKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...categoriasKeys.lists(), filters] as const,
  details: () => [...categoriasKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoriasKeys.details(), id] as const,
};

// Hooks para queries (GET)
export function useCategorias() {
  return useQuery({
    queryKey: categoriasKeys.lists(),
    queryFn: categoriasService.getAll,
  });
}

export function useCategoria(id: string) {
  return useQuery({
    queryKey: categoriasKeys.detail(id),
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
      queryClient.invalidateQueries({ queryKey: categoriasKeys.lists() });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoriaDto }) => 
      categoriasService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalida la lista y el detalle de la categoría actualizada
      queryClient.invalidateQueries({ queryKey: categoriasKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriasKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriasKeys.lists() });
    },
  });
}
