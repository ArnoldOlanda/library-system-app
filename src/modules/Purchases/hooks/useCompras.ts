import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService } from '../services/compras.service';
import type { CreateCompraDto } from '../interfaces';

const QUERY_KEY = 'compras';

export const useCompras = (page?: number, pageSize?: number, search?: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, page, pageSize, search],
    queryFn: () => comprasService.getAll(page, pageSize, search),
  });
};

export const useCompra = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => comprasService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCompra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCompraDto) => comprasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos-almacen'] });
    },
  });
};

export const useDeleteCompra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => comprasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
