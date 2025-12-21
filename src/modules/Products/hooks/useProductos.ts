import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '@/modules/Products/services/productos.service';
import type { CreateProductoDto, UpdateProductoDto } from '../interfaces';

// Query Keys
export const productosKeys = {
  all: ['productos'] as const,
  lists: () => [...productosKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...productosKeys.lists(), filters] as const,
  details: () => [...productosKeys.all, 'detail'] as const,
  detail: (id: string) => [...productosKeys.details(), id] as const,
};

// Hooks para queries (GET)
export function useProductos() {
  return useQuery({
    queryKey: productosKeys.lists(),
    queryFn: productosService.getAll,
  });
}

export function useProducto(id: string) {
  return useQuery({
    queryKey: productosKeys.detail(id),
    queryFn: () => productosService.getById(id),
    enabled: !!id, // Solo ejecutar si hay id
  });
}

// Hooks para mutaciones (POST, PUT, DELETE)
export function useCreateProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: CreateProductoDto) => productosService.create(producto),
    onSuccess: () => {
      // Invalida y refetch la lista de productos
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
    },
  });
}

export function useUpdateProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductoDto }) => 
      productosService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalida la lista y el detalle del producto actualizado
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productosKeys.detail(variables.id) });
    },
  });
}

export function useDeleteProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() });
    },
  });
}
