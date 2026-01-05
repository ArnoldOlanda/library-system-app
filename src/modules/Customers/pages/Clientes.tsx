import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ClientesTable } from '../components/ClientesTable';
import { ClienteDialog } from '../components/ClienteDialog';
import {
  useClientes,
  useCreateCliente,
  useUpdateCliente,
  useDeleteCliente,
} from '../hooks/useClientes';
import type { CreateClienteDto, Cliente } from '../interfaces';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

export function Clientes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState<string | undefined>(undefined);

  // Debounce search para evitar peticiones excesivas
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useClientes(page, pageSize, debouncedSearch);
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();
  const deleteMutation = useDeleteCliente();

  const handleCreate = () => {
    setSelectedCliente(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDialogOpen(true);
  };

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!clienteToDelete) return;

    try {
      await deleteMutation.mutateAsync(clienteToDelete.id);
      toast.success('Cliente eliminado correctamente');
      setDeleteDialogOpen(false);
      setClienteToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el cliente'
      );
    }
  };

  const handleSubmit = async (data: CreateClienteDto) => {
    try {
      if (selectedCliente) {
        await updateMutation.mutateAsync({
          id: selectedCliente.id,
          data,
        });
        toast.success('Cliente actualizado correctamente');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Cliente creado correctamente');
      }
      setDialogOpen(false);
      setSelectedCliente(undefined);
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Error al guardar el cliente');
      }
    }
  };

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los clientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona los clientes del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <ClientesTable
        data={data?.data}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={selectedCliente}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={(open: boolean) => setDeleteDialogOpen(open)}
        title="¿Estás seguro?"
        description={
          <>
            Esta acción no se puede deshacer. Se eliminará el
            cliente <strong>{clienteToDelete?.nombre}</strong>.
          </>
        }
        onConfirm={confirmDelete}
        cancelText="Cancelar"
        confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Si, eliminar'}
      />
    </div>
  );
}
