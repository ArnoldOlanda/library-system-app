import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movimientosAlmacenService } from '../services/movimientos-almacen.service';
import type { CreateMovimientoAlmacenDto, QueryMovimientoAlmacenDto } from '../interfaces';

const QUERY_KEY = 'movimientos-almacen';

export const useMovimientosAlmacen = (query?: QueryMovimientoAlmacenDto) => {
  return useQuery({
    queryKey: [QUERY_KEY, query],
    queryFn: () => movimientosAlmacenService.getAll(query),
  });
};

export const useMovimientoAlmacen = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => movimientosAlmacenService.getById(id),
    enabled: !!id,
  });
};

export const useMovimientosByProducto = (
  productoId: string,
  query?: QueryMovimientoAlmacenDto
) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'producto', productoId, query],
    queryFn: () => movimientosAlmacenService.getByProducto(productoId, query),
    enabled: !!productoId,
  });
};

export const useMovimientosByReferencia = (
  referenciaId: string,
  query?: QueryMovimientoAlmacenDto
) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'referencia', referenciaId, query],
    queryFn: () => movimientosAlmacenService.getByReferencia(referenciaId, query),
    enabled: !!referenciaId,
  });
};

export const useCreateMovimiento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMovimientoAlmacenDto) =>
      movimientosAlmacenService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};
