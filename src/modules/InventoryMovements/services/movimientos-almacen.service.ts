import { API } from '@/api';
import type { ApiResponse } from '@/interfaces';
import type {
  MovimientoAlmacen,
  MovimientoAlmacenResponse,
  CreateMovimientoAlmacenDto,
  QueryMovimientoAlmacenDto,
} from '../interfaces';

export const movimientosAlmacenService = {
  getAll: async (query?: QueryMovimientoAlmacenDto) => {
    const params = new URLSearchParams();
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());
    if (query?.productoId) params.append('productoId', query.productoId);
    if (query?.tipoMovimiento) params.append('tipoMovimiento', query.tipoMovimiento);
    if (query?.origenMovimiento) params.append('origenMovimiento', query.origenMovimiento);
    if (query?.referenciaId) params.append('referenciaId', query.referenciaId);

    const response = await API.get<ApiResponse<MovimientoAlmacenResponse>>(
      `/movimientos-almacen?${params.toString()}`
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await API.get<ApiResponse<MovimientoAlmacen>>(
      `/movimientos-almacen/${id}`
    );
    return response.data.data;
  },

  getByProducto: async (productoId: string, query?: QueryMovimientoAlmacenDto) => {
    const params = new URLSearchParams();
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());

    const response = await API.get<ApiResponse<MovimientoAlmacenResponse>>(
      `/movimientos-almacen/producto/${productoId}?${params.toString()}`
    );
    return response.data.data;
  },

  getByReferencia: async (referenciaId: string, query?: QueryMovimientoAlmacenDto) => {
    const params = new URLSearchParams();
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());

    const response = await API.get<ApiResponse<MovimientoAlmacenResponse>>(
      `/movimientos-almacen/referencia/${referenciaId}?${params.toString()}`
    );
    return response.data.data;
  },

  create: async (data: CreateMovimientoAlmacenDto) => {
    const response = await API.post<ApiResponse<MovimientoAlmacen>>(
      '/movimientos-almacen',
      data
    );
    return response.data.data;
  },
};
