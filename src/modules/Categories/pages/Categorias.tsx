import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from '../hooks/useCategorias';
import { CategoriasTable } from '../components/CategoriasTable';
import { CategoriaDialog } from '../components/CategoriaDialog';
import { type CategoriaFormValues } from '../components/CategoriaForm';
import { toast } from 'sonner';
import type { Categoria } from '../interfaces';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

export function Categorias() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState<string | undefined>(undefined);

  // Debounce search para evitar peticiones excesivas
  const debouncedSearch = useDebounce(search, 500);

  // Queries y mutaciones
  const { data: categorias, isLoading } = useCategorias(page, pageSize, debouncedSearch);
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();
  const deleteMutation = useDeleteCategoria();

  const handleCreate = () => {
    setSelectedCategoria(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setDialogOpen(true);
  };

  const handleDelete = async (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if(!selectedCategoria) return;

    try {
      await deleteMutation.mutateAsync(selectedCategoria.id);
      toast.success('Categoría eliminada correctamente',{
        position: 'top-center'
      });
      setDeleteDialogOpen(false);
      setSelectedCategoria(undefined);
    } catch (error) {
      toast.error(
        (error as any).response?.data?.message || 'Error al eliminar la categoría',
        { position: 'top-center' }
      );
    }
  }

  const handleSubmit = async (data: CategoriaFormValues) => {
    if (selectedCategoria) {
      // Actualizar
      await updateMutation.mutateAsync(
        { id: selectedCategoria.id, data },
        {
          onSuccess: () => {
            toast.success('Categoría actualizada exitosamente');
          },
          onError: (error: Error) => {
            toast.error(`Error al actualizar: ${error.message}`);
            throw error;
          },
        }
      );
    } else {
      // Crear
      await createMutation.mutateAsync(data, {
        onSuccess: () => {
          toast.success('Categoría creada exitosamente');
        },
        onError: (error: Error) => {
          toast.error(`Error al crear: ${error.message}`);
          throw error;
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">
            Gestiona las categorías de productos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <CategoriasTable
        data={categorias}
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

      <CategoriaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoria={selectedCategoria}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={(open: boolean) => setDeleteDialogOpen(open)}
        title="¿Estás seguro?"
        description={
          <>
            Esta acción no se puede deshacer. Se eliminará la
            categoría <strong>{selectedCategoria?.nombre}</strong>.
          </>
        }
        onConfirm={confirmDelete}
        cancelText="Cancelar"
        confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Si, eliminar'}
      />
    </div>
  );
}

