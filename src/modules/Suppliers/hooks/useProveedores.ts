import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedoresService } from '../services/proveedores.service';
import type { CreateProveedorDto, UpdateProveedorDto } from '../interfaces';

const QUERY_KEY = 'proveedores';

export const useProveedores = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit],
    queryFn: () => proveedoresService.getAll(page, limit),
  });
};

export const useProveedor = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => proveedoresService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProveedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProveedorDto) => proveedoresService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateProveedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProveedorDto }) =>
      proveedoresService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteProveedor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proveedoresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
