import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Role, Permission } from '../interfaces';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  allPermissions: Permission[];
  onAssign: (roleId: string, permissionIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function PermissionsAssignDialog({
  open,
  onOpenChange,
  role,
  allPermissions,
  onAssign,
  isLoading,
}: Props) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Inicializar permisos seleccionados cuando cambia el rol
  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions.map(p => p.id));
    }
  }, [role]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async () => {
    if (!role) return;
    await onAssign(role.id, selectedPermissions);
    onOpenChange(false);
  };

  // Agrupar permisos por entidad
  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    const parts = permission.name.split(':');
    const entity = parts[1] || 'general';
    if (!acc[entity]) {
      acc[entity] = [];
    }
    acc[entity].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Gestionar Permisos del Rol</DialogTitle>
          <DialogDescription>
            Asigna o remueve permisos para el rol: <strong>{role?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-100 pr-4">
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([entity, permissions]) => (
              <div key={entity} className="space-y-3">
                <h3 className="font-semibold text-sm capitalize border-b pb-2">
                  {entity.replace(/_/g, ' ')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {permissions.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={permission.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {permission.description || permission.name}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Badge variant="secondary" className="mr-auto">
            {selectedPermissions.length} permisos seleccionados
          </Badge>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
