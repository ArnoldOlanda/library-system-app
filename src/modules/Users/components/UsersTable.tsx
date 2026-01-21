import {
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import type { User, UserResponse } from '../interfaces';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { TableProps } from '@/interfaces';
import { useTable } from '@/hooks/useTable';
import { Pagination } from '@/components/Pagination';

export function UsersTable({
  isLoading,
  data,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
}: TableProps<UserResponse, User>) {

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        return (
          <div className="flex gap-1 flex-wrap">
            {roles.length > 0 ? (
              roles.map((role) => (
                <Badge key={role.id} variant="secondary">
                  {role.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">Sin roles</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(user)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const {pagination, table} = useTable<UserResponse, User>({
    data,
    columns,
    key: 'users',
    onPageSizeChange,
    onPageChange
  });

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="flex items-center gap-2">
        <Input
            placeholder="Buscar por nombre o email..."
            value={search ?? ''}
            onChange={(e) => {
                const value = e.target.value;
                onSearchChange(value || undefined);
            }}
            className="max-w-sm"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        {
            isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-muted-foreground">Cargando usuarios...</div>
                </div>
            ) : (
                <Table className='bg-card'>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            ))}
                        </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                            >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                            >
                            No se encontraron usuarios.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            )
        }
        
      </div>

      {/* Paginación */}
      <Pagination table={table} pagination={pagination} />
    </div>
  );
}
