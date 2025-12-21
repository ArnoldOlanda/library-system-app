import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductos, useCreateProducto, useUpdateProducto, useDeleteProducto } from '../hooks/useProductos';
import { useCategorias } from '@/modules/Categories/hooks/useCategorias';
import { ProductosTable } from '../components/ProductosTable';
import { ProductoDialog } from '../components/ProductoDialog';
import { type ProductoFormValues } from '../components/ProductoForm';
import { toast } from 'sonner';
import type { Producto } from '../interfaces';

export function Productos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>();

  // Queries y mutaciones
  const { data: productos = [], isLoading } = useProductos();
  const { data: categorias = [], isLoading: isLoadingCategorias } = useCategorias();
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Producto eliminado exitosamente');
      },
      onError: (error: Error) => {
        toast.error(`Error al eliminar: ${error.message}`);
      },
    });
  };

  const handleSubmit = async (data: ProductoFormValues) => {
    // Convertir strings a números
    const productoData = {
      codigo: data.codigo,
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

  if (isLoading || isLoadingCategorias) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el inventario de productos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <ProductosTable
        data={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        producto={selectedProducto}
        categorias={categorias}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

