import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Producto } from '../interfaces';
import { useProductos, useCreateProducto, useUpdateProducto, useDeleteProducto } from '../hooks/useProductos';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { ProductosTable } from '../components/ProductosTable';
import { ProductoDialog } from '../components/ProductoDialog';
import { type ProductoFormValues } from '../components/ProductoForm';
import { useDebounce } from '@/hooks/useDebounce';
import { Can } from '@/components/Can';

export function Productos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState<string | undefined>(undefined);

  // Debounce search para evitar peticiones excesivas
  const debouncedSearch = useDebounce(search, 500);

  // Queries y mutaciones
  const { data: productos, isLoading } = useProductos(page, pageSize, debouncedSearch);
  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();
  const deleteMutation = useDeleteProducto();

  const handleCreate = () => {
    setSelectedProducto(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setDialogOpen(true);
  };

  const handleDelete = async (producto: Producto) => {
    setProductoToDelete(producto);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productoToDelete) return;

    try {
      await deleteMutation.mutateAsync(productoToDelete.id);
      toast.success('Producto eliminado correctamente');
      setDeleteDialogOpen(false);
      setProductoToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el producto'
      );
    }
  }

  const handleSubmit = async (data: ProductoFormValues) => {
    // Convertir strings a números
    const productoData = {
      codigo: data.codigo,
      codigoBarras: data.codigoBarras,
      nombre: data.nombre,
      categoriaId: data.categoriaId,
      precioCompra: parseFloat(data.precioCompra),
      precioVenta: parseFloat(data.precioVenta),
      stock: data.stock ? parseInt(data.stock) : 0,
      stockMinimo: data.stockMinimo ? parseInt(data.stockMinimo) : 0,
      descripcion: data.descripcion,
    };

    if (selectedProducto) {
      // Actualizar
      await updateMutation.mutateAsync(
        { id: selectedProducto.id, data: productoData },
        {
          onSuccess: () => {
            toast.success('Producto actualizado exitosamente');
          },
          onError: (error: Error) => {
            toast.error(`Error al actualizar: ${error.message}`);
            throw error;
          },
        }
      );
    } else {
      // Crear
      await createMutation.mutateAsync(productoData, {
        onSuccess: () => {
          toast.success('Producto creado exitosamente');
        },
        onError: (error: Error) => {
          toast.error(`Error al crear: ${error.message}`);
          throw error;
        },
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el inventario de productos
          </p>
        </div>
        <Can I='create' a='producto'>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Can>
      </div>

      <ProductosTable
        isLoading={isLoading}
        data={productos}
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

      <ProductoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        producto={selectedProducto}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog 
        open={deleteDialogOpen}
        setOpen={(open: boolean) => setDeleteDialogOpen(open)}
        title="¿Estás seguro?"
        description={
          <>
            Esta acción no se puede deshacer. Se eliminará el
            producto <strong>{productoToDelete?.nombre}</strong>.
          </>
        }
        onConfirm={confirmDelete}
        destructive
        cancelText="Cancelar"
        confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Si, eliminar'}
      />
    </div>
  );
}

