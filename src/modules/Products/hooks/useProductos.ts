import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productosService } from '@/modules/Products/services/productos.service';
import type { CreateProductoDto, UpdateProductoDto } from '../interfaces';

// Query Keys
const QUERY_KEY = 'productos';

// Hooks para queries (GET)
export function useProductos(page?: number, limit?: number, search?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit, search],
    queryFn: ()=>productosService.getAll(page, limit, search),
  });
}

export function useProducto(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductoDto }) => 
      productosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
