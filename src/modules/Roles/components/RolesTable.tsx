import { type ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Shield } from 'lucide-react';
import type { Role } from '../interfaces';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Can } from '@/components/Can';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface RolesTableProps {
  data: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
}

export function RolesTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onManagePermissions,
}: RolesTableProps) {
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue('description') || 'Sin descripción'}
        </div>
      ),
    },
    {
      accessorKey: 'permissions',
      header: 'Permisos',
      cell: ({ row }) => {
        const permissions = row.getValue('permissions') as Role['permissions'];
        
        return (
          <Badge variant="outline">
            {permissions.length} {permissions.length === 1 ? 'permiso' : 'permisos'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <div className="text-sm">{date.toLocaleDateString('es-ES')}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex gap-2">
            <Can I='update' a='role'>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onManagePermissions(role)}
                title="Gestionar permisos"
              >
                <Shield className="h-4 w-4" />
              </Button>
            </Can>
            <Can I='update' a='role'>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onEdit(role)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Can>
            <Can I='delete' a='role'>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => onDelete(role)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Can>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
          <p className="mt-2 text-sm text-muted-foreground">Cargando roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
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
                  No se encontraron roles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
