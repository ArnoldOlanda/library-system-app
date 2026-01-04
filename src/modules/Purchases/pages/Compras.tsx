import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ComprasTable } from '../components/ComprasTable';
import { CompraDialog } from '../components/CompraDialog';
import { CompraDetalleDialog } from '../components/CompraDetalleDialog';
import {
  useCompras,
  useCreateCompra,
  useDeleteCompra,
} from '../hooks/useCompras';
import type { CreateCompraDto, Compra } from '../interfaces';
import { toast } from 'sonner';
import { format } from '@formkit/tempo';
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

export function Compras() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalleDialogOpen, setDetalleDialogOpen] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compraToDelete, setCompraToDelete] = useState<Compra | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState<string | undefined>(undefined);
  
  // Debounce search para evitar peticiones excesivas
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useCompras(page, pageSize, debouncedSearch);
  const createMutation = useCreateCompra();
  const deleteMutation = useDeleteCompra();

  const handleCreate = () => {
    setDialogOpen(true);
  };

  const handleView = (compra: Compra) => {
    setSelectedCompra(compra);
    setDetalleDialogOpen(true);
  };

  const handleDelete = (compra: Compra) => {
    setCompraToDelete(compra);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!compraToDelete) return;

    try {
      await deleteMutation.mutateAsync(compraToDelete.id);
      toast.success('Compra eliminada correctamente');
      setDeleteDialogOpen(false);
      setCompraToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al eliminar la compra'
      );
    }
  };

  const handleSubmit = async (data: CreateCompraDto) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Compra registrada correctamente');
      setDialogOpen(false);
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message || 'Error al registrar la compra');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-sm text-muted-foreground">Cargando compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar las compras</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
          <p className="text-muted-foreground">
            Gestiona las compras a proveedores
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Compra
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ComprasTable
          isLoading={isLoading}
          data={data}
          onView={handleView}
          onEdit={()=>{}}
          onDelete={handleDelete}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          search={search}
          onSearchChange={setSearch}
        />
      </div>


      <CompraDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />

      <CompraDetalleDialog
        open={detalleDialogOpen}
        onOpenChange={setDetalleDialogOpen}
        compra={selectedCompra}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              compra realizada el{' '}
              <strong>
                {compraToDelete &&
                  format(new Date(compraToDelete.fechaCompra), 'DD/MM/YYYY', 'es')}
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
