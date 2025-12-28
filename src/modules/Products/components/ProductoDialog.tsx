import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductoForm, type ProductoFormValues } from './ProductoForm';
import type { Producto } from '../interfaces';
import { useCategorias } from '@/modules/Categories/hooks/useCategorias';

interface ProductoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  producto?: Producto;
  onSubmit: (data: ProductoFormValues) => Promise<void>;
}

export function ProductoDialog({
  open,
  onOpenChange,
  producto,
  onSubmit,
}: ProductoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: categoriasData } = useCategorias();

  const handleSubmit = async (data: ProductoFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogDescription>
            {producto
              ? 'Modifica los datos del producto'
              : 'Completa los datos para crear un nuevo producto'}
          </DialogDescription>
        </DialogHeader>
        <ProductoForm
          producto={producto}
          categorias={categoriasData?.categorias || []}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
