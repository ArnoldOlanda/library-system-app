import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClienteForm } from './ClienteForm';
import { type CreateClienteDto, type Cliente } from '../interfaces';

interface ClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente;
  onSubmit: (data: CreateClienteDto) => void;
  isLoading?: boolean;
}

export function ClienteDialog({
  open,
  onOpenChange,
  cliente,
  onSubmit,
  isLoading,
}: ClienteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {cliente
              ? 'Actualiza la información del cliente'
              : 'Completa el formulario para agregar un nuevo cliente'}
          </DialogDescription>
        </DialogHeader>
        <ClienteForm
          cliente={cliente}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
