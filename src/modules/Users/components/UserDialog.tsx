import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { UserForm, type UserFormValues } from './UserForm';
import type { User } from '../interfaces';
import { useState } from 'react';
import { useRoles } from '../hooks/useRoles';

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
    onSubmit: (data: UserFormValues) => Promise<void>;
}

export function UserDialog({ open, onOpenChange, user, onSubmit }: UserDialogProps) {
    const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (data: UserFormValues) => {
        setIsLoading(true);
        try {
            await onSubmit(data);
            onOpenChange(false);
        } catch (error) {
            console.log('Error al guardar usuario', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
                    <DialogDescription>
                        {user
                            ? 'Actualiza los datos del usuario'
                            : 'Completa el formulario para crear un nuevo usuario'}
                    </DialogDescription>
                </DialogHeader>
                {!isLoadingRoles && (
                    <UserForm
                        user={user}
                        roles={roles}
                        onSubmit={handleSubmit}
                        onCancel={() => onOpenChange(false)}
                        isLoading={isLoading}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
