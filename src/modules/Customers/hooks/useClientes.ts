import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '../services/clientes.service';
import type { CreateClienteDto, UpdateClienteDto } from '../interfaces';

const QUERY_KEY = 'clientes';

export const useClientes = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit],
    queryFn: () => clientesService.getAll(page, limit),
  });
};

export const useCliente = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => clientesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClienteDto) => clientesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClienteDto }) =>
      clientesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
