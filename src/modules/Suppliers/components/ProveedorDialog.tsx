import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProveedorForm } from './ProveedorForm';
import { type CreateProveedorDto, type Proveedor } from '../interfaces';

interface ProveedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor?: Proveedor;
  onSubmit: (data: CreateProveedorDto) => void;
  isLoading?: boolean;
}

export function ProveedorDialog({
  open,
  onOpenChange,
  proveedor,
  onSubmit,
  isLoading,
}: ProveedorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>
            {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </DialogTitle>
          <DialogDescription>
            {proveedor
              ? 'Actualiza la información del proveedor'
              : 'Completa el formulario para agregar un nuevo proveedor'}
          </DialogDescription>
        </DialogHeader>
        <ProveedorForm
          proveedor={proveedor}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
