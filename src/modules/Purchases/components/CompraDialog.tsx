import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompraForm } from './CompraForm';
import type { CreateCompraDto } from '../interfaces';

interface CompraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCompraDto) => void;
  isLoading?: boolean;
}

export function CompraDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CompraDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl lg:w-[60%] md:w-[80%] sm:w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Compra</DialogTitle>
          <DialogDescription>
            Registra una nueva compra de productos
          </DialogDescription>
        </DialogHeader>
        <CompraForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
