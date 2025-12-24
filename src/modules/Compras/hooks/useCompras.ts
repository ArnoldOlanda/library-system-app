import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comprasService } from '../../Purchases/services/compras.service';
import type { CreateCompraDto } from '../../Purchases/interfaces';

const QUERY_KEY = 'compras';

export const useCompras = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: [QUERY_KEY, limit, offset],
    queryFn: () => comprasService.getAll(limit, offset),
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
