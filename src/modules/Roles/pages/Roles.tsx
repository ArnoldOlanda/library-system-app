import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { Role } from '../interfaces';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole, useAssignPermissions } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { RolesTable } from '../components/RolesTable';
import { RoleDialog } from '../components/RoleDialog';
import { PermissionsAssignDialog } from '../components/PermissionsAssignDialog';
import { type RoleFormValues } from '../components/RoleForm';
import { Can } from '@/components/Can';

export function Roles() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [roleToManage, setRoleToManage] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Queries y mutaciones
  const { data: roles = [], isLoading } = useRoles();
  const { data: allPermissions = [] } = usePermissions();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();
  const assignPermissionsMutation = useAssignPermissions();

  const handleCreate = () => {
    setSelectedRole(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleDelete = async (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await deleteMutation.mutateAsync(roleToDelete.id);
      toast.success('Rol eliminado correctamente');
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el rol'
      );
    }
  };

  const handleManagePermissions = (role: Role) => {
    setRoleToManage(role);
    setPermissionsDialogOpen(true);
  };

  const handleSubmit = async (data: RoleFormValues) => {
    try {
      if (selectedRole) {
        // Actualizar
        await updateMutation.mutateAsync(
          { id: selectedRole.id, data },
          {
            onSuccess: () => {
              toast.success('Rol actualizado exitosamente');
              setDialogOpen(false);
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
            toast.success('Rol creado exitosamente');
            setDialogOpen(false);
          },
          onError: (error: Error) => {
            toast.error(`Error al crear: ${error.message}`);
            throw error;
          },
        });
      }
    } catch (error) {
      // Error ya manejado
    }
  };

  const handleAssignPermissions = async (roleId: string, permissionIds: string[]) => {
    try {
      await assignPermissionsMutation.mutateAsync(
        { roleId, data: { permissionIds } },
        {
          onSuccess: () => {
            toast.success('Permisos actualizados correctamente');
          },
          onError: (error: Error) => {
            toast.error(`Error al actualizar permisos: ${error.message}`);
            throw error;
          },
        }
      );
    } catch (error) {
      // Error ya manejado
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles y Permisos</h1>
          <p className="text-muted-foreground">
            Gestiona los roles del sistema y sus permisos asociados
          </p>
        </div>
        <Can I='create' a='role'>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Rol
          </Button>
        </Can>
      </div>

      <RolesTable
        isLoading={isLoading}
        data={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManagePermissions={handleManagePermissions}
      />

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <PermissionsAssignDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        role={roleToManage}
        allPermissions={allPermissions}
        onAssign={handleAssignPermissions}
        isLoading={assignPermissionsMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={(open: boolean) => setDeleteDialogOpen(open)}
        title="¿Estás seguro?"
        description={
          <>
            Esta acción no se puede deshacer. Se eliminará el rol{' '}
            <strong>{roleToDelete?.name}</strong> y sus asociaciones.
          </>
        }
        onConfirm={confirmDelete}
        destructive
        cancelText="Cancelar"
        confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
      />
    </div>
  );
}
