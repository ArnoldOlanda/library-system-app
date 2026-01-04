import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProveedoresTable } from '../components/ProveedoresTable';
import { ProveedorDialog } from '../components/ProveedorDialog';
import {
  useProveedores,
  useCreateProveedor,
  useUpdateProveedor,
  useDeleteProveedor,
} from '../hooks/useProveedores';
import type { CreateProveedorDto, Proveedor } from '../interfaces';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDebounce } from '@/hooks/useDebounce';

export default function Proveedores() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<Proveedor | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useProveedores(page, pageSize, debouncedSearch);
  const createMutation = useCreateProveedor();
  const updateMutation = useUpdateProveedor();
  const deleteMutation = useDeleteProveedor();

  const handleCreate = () => {
    setSelectedProveedor(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setDialogOpen(true);
  };

  const handleDelete = (proveedor: Proveedor) => {
    setProveedorToDelete(proveedor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!proveedorToDelete) return;

    try {
      await deleteMutation.mutateAsync(proveedorToDelete.id);
      toast.success('Proveedor eliminado correctamente');
      setDeleteDialogOpen(false);
      setProveedorToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el proveedor'
      );
    }
  };

  const handleSubmit = async (data: CreateProveedorDto) => {
    try {
      if (selectedProveedor) {
        await updateMutation.mutateAsync({
          id: selectedProveedor.id,
          data,
        });
        toast.success('Proveedor actualizado correctamente');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Proveedor creado correctamente');
      }
      setDialogOpen(false);
      setSelectedProveedor(undefined);
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Error al guardar el proveedor');
      }
    }
  };

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los proveedores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona los proveedores del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ProveedoresTable
          isLoading={isLoading}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          search={search}
          onSearchChange={setSearch}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>


      <ProveedorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        proveedor={selectedProveedor}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el
              proveedor <strong>{proveedorToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
