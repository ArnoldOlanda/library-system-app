import { flexRender, type ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
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
import type { Proveedor, ProveedorResponse } from '../interfaces';
import type { TableProps } from '@/interfaces';
import { useTable } from '@/hooks/useTable';
import { Pagination } from '@/components/Pagination';


export function ProveedoresTable({
  isLoading,
  data,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
}: TableProps<ProveedorResponse, Proveedor>) {

  const columns: ColumnDef<Proveedor>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => <div className="font-medium">{row.getValue('nombre')}</div>,
    },
    {
      accessorKey: 'contacto',
      header: 'Contacto',
      cell: ({ row }) => {
        const contacto = row.getValue('contacto') as string;
        return <div>{contacto || '-'}</div>;
      },
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
      cell: ({ row }) => {
        const telefono = row.getValue('telefono') as string;
        return <div>{telefono || '-'}</div>;
      },
    },
    {
      accessorKey: 'correo',
      header: 'Correo',
      cell: ({ row }) => {
        const correo = row.getValue('correo') as string;
        return <div className="text-sm">{correo || '-'}</div>;
      },
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
      cell: ({ row }) => {
        const direccion = row.getValue('direccion') as string;
        return (
          <div className="max-w-50 truncate text-sm" title={direccion}>
            {direccion || '-'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const proveedor = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(proveedor)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(proveedor)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const { pagination, table } = useTable<ProveedorResponse, Proveedor>({
    data,
    columns,
    key: 'proveedores',
    onPageSizeChange,
    onPageChange
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrar por nombre..."
          value={search ?? ''}
          onChange={(event) => {
            const value = event.target.value;
            onSearchChange(value || undefined);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Cargando proveedores...</div>
          </div>
        ) : (
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
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

      </div>

      <Pagination table={table} pagination={pagination} />
    </div>
  );
}
