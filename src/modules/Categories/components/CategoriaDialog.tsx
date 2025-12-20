import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoriaForm, type CategoriaFormValues } from './CategoriaForm';
import { type Categoria } from '../services/categorias.service';

interface CategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria?: Categoria;
  onSubmit: (data: CategoriaFormValues) => Promise<void>;
}

export function CategoriaDialog({
  open,
  onOpenChange,
  categoria,
  onSubmit,
}: CategoriaDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CategoriaFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {categoria
              ? 'Modifica los datos de la categoría'
              : 'Completa los datos para crear una nueva categoría'}
          </DialogDescription>
        </DialogHeader>
        <CategoriaForm
          categoria={categoria}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
