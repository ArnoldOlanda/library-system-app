import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { User } from '../interfaces';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useAssignRole,
  useRemoveRole,
} from '../hooks/useUsers';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { UsersTable } from '../components/UsersTable';
import { UserDialog } from '../components/UserDialog';
import { type UserFormValues } from '../components/UserForm';
import { useDebounce } from '@/hooks/useDebounce';

export function Users() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState<string | undefined>(undefined);

  // Debounce search para evitar peticiones excesivas
  const debouncedSearch = useDebounce(search, 500);

  // Queries y mutaciones
  const { data: users, isLoading } = useUsers(page, pageSize, debouncedSearch);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();

  const handleCreate = () => {
    setSelectedUser(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteMutation.mutateAsync(userToDelete.id);
      toast.success('Usuario eliminado correctamente');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al eliminar el usuario'
      );
    }
  };

  const handleSubmit = async (data: UserFormValues) => {
    try {
      // Preparar datos - eliminar password si está vacío en edición
      const userData: any = {
        name: data.name,
        email: data.email,
      };

      // Manejar avatar si es un archivo
      if (data.avatar && data.avatar instanceof File) {
        // Convertir archivo a base64
        const reader = new FileReader();
        await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data.avatar);
        });
        // userData.avatar = base64Avatar;
        userData.avatar = '';
      } else if (data.avatar === undefined) {
        // Si se removió el avatar, no incluirlo en la actualización
        // o enviarlo como null si quieres eliminarlo del usuario
        // userData.avatar = null;
      }

      // Solo incluir password si no está vacío
      if (data.password && data.password.trim() !== '') {
        userData.password = data.password;
      }

      if (selectedUser) {
        // Actualizar usuario
        await updateMutation.mutateAsync(
          { id: selectedUser.id, data: userData },
          {
            onSuccess: async (updatedUser) => {
              // Gestionar cambios en roles
              const currentRoleIds = selectedUser.roles?.map(r => r.id) || [];
              const newRoleIds = data.roleIds || [];
              
              // Roles a agregar
              const rolesToAdd = newRoleIds.filter(id => !currentRoleIds.includes(id));
              // Roles a remover
              const rolesToRemove = currentRoleIds.filter(id => !newRoleIds.includes(id));

              // Asignar nuevos roles
              for (const roleId of rolesToAdd) {
                await assignRoleMutation.mutateAsync({ userId: updatedUser.id, roleId });
              }

              // Remover roles antiguos
              for (const roleId of rolesToRemove) {
                await removeRoleMutation.mutateAsync({ userId: updatedUser.id, roleId });
              }

              toast.success('Usuario actualizado exitosamente');
            },
            onError: (error: any) => {
              toast.error(
                error.response?.data?.message || 'Error al actualizar el usuario'
              );
              throw error;
            },
          }
        );
      } else {
        // Crear usuario
        if (!data.password || data.password.trim() === '') {
          toast.error('La contraseña es requerida para crear un usuario');
          throw new Error('Password required');
        }

        await createMutation.mutateAsync(userData, {
          onSuccess: async (createdUser) => {
            // Asignar roles al nuevo usuario
            if (data.roleIds && data.roleIds.length > 0) {
              for (const roleId of data.roleIds) {
                await assignRoleMutation.mutateAsync({ userId: createdUser.id, roleId });
              }
            }
            toast.success('Usuario creado exitosamente');
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || 'Error al crear el usuario'
            );
            throw error;
          },
        });
      }
    } catch (error: any) {
      // El error ya se maneja en los callbacks onError
      if (error.message !== 'Password required') {
        console.error('Error en handleSubmit:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <UsersTable
        isLoading={isLoading}
        data={users}
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

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={(open: boolean) => setDeleteDialogOpen(open)}
        title="¿Estás seguro?"
        description={
          <>
            Esta acción no se puede deshacer. Se eliminará el usuario{' '}
            <strong>{userToDelete?.name}</strong>.
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