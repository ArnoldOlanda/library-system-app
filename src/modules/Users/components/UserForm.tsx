import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Check } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { User, Role } from '../interfaces';

const userSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .email('Email inválido')
    .min(1, 'El email es requerido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(20, 'La contraseña no puede exceder 20 caracteres')
    .optional()
    .or(z.literal('')),
  avatar: z.any().optional(),
  roleIds: z.array(z.string()),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  roles: Role[];
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, roles, onSubmit, onCancel, isLoading }: UserFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  const [openRoles, setOpenRoles] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      avatar: undefined,
      roleIds: user?.roles?.map(r => r.id) || [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Actualizar el formulario
      form.setValue('avatar', file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    form.setValue('avatar', undefined);
  };

  const getInitials = () => {
    const name = form.watch('name') || user?.name || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {user ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="******"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel>Avatar (opcional)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Input de archivo */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="cursor-pointer"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {avatarPreview && (
                    <div className="relative flex items-center justify-center gap-4">
                      <Avatar className="h-28 w-28">
                        <AvatarImage src={avatarPreview} alt="Avatar preview" className=''/>
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className='absolute rounded-full top-1 left-[55%] ml-2 h-6 w-6'
                        onClick={handleRemoveAvatar}
                        disabled={isLoading}
                      >
                        <X/>
                      </Button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Formatos soportados: JPG, PNG, GIF. Máximo 2MB.
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roleIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Roles</FormLabel>
              <Popover open={openRoles} onOpenChange={setOpenRoles}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={isLoading}
                      className={cn(
                        'w-full justify-between',
                        !field.value?.length && 'text-muted-foreground'
                      )}
                    >
                      {field.value?.length > 0
                        ? `${field.value.length} rol(es) seleccionado(s)`
                        : 'Seleccionar roles'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar rol..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron roles.</CommandEmpty>
                      <CommandGroup>
                        {roles.map((role) => {
                          const isSelected = field.value?.includes(role.id);
                          return (
                            <CommandItem
                              key={role.id}
                              onSelect={() => {
                                const newValue = isSelected
                                  ? field.value.filter((id) => id !== role.id)
                                  : [...(field.value || []), role.id];
                                field.onChange(newValue);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  isSelected ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {role.name}
                              {role.description && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  - {role.description}
                                </span>
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Selecciona los roles que tendrá este usuario
              </FormDescription>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((roleId) => {
                    const role = roles.find((r) => r.id === roleId);
                    return role ? (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive"
                          onClick={() => {
                            field.onChange(
                              field.value.filter((id) => id !== roleId)
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
