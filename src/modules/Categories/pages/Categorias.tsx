import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from '../hooks/useCategorias';
import { CategoriasTable } from '../components/CategoriasTable';
import { CategoriaDialog } from '../components/CategoriaDialog';
import { type Categoria } from '../services/categorias.service';
import { type CategoriaFormValues } from '../components/CategoriaForm';
import { toast } from 'sonner';

export function Categorias() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | undefined>();

  // Queries y mutaciones
  const { data: categorias = [], isLoading } = useCategorias();
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Categoría eliminada exitosamente');
      },
      onError: (error: Error) => {
        toast.error(`Error al eliminar: ${error.message}`);
      },
    });
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando categorías...</div>
      </div>
    );
  }

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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoriaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoria={selectedCategoria}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

