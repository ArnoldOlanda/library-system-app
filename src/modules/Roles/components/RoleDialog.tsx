import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoleForm, type RoleFormValues } from './RoleForm';
import type { Role } from '../interfaces';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role;
  onSubmit: (data: RoleFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function RoleDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  isLoading,
}: RoleDialogProps) {
  const handleSubmit = async (data: RoleFormValues) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Editar Rol' : 'Crear Nuevo Rol'}
          </DialogTitle>
          <DialogDescription>
            {role
              ? 'Modifica los datos del rol existente'
              : 'Ingresa los datos del nuevo rol'}
          </DialogDescription>
        </DialogHeader>
        <RoleForm
          defaultValues={
            role
              ? {
                  name: role.name,
                  description: role.description,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
