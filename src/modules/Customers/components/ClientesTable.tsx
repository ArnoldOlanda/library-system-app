import { flexRender, type ColumnDef } from '@tanstack/react-table';
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
import type { Cliente, ClienteResponse } from '../interfaces';
import { Pencil, Trash2 } from 'lucide-react';
import { type TableProps } from '../../../interfaces/index';
import { Pagination } from '@/components/Pagination';
import { useTable } from '@/hooks/useTable';
import { Can } from '@/components/Can';


export function ClientesTable({
  isLoading,
  data,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange
}: TableProps<ClienteResponse, Cliente>) {

  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => <div className="font-medium">{row.getValue('nombre')}</div>,
    },
    {
      accessorKey: 'dni',
      header: 'DNI',
      cell: ({ row }) => {
        const dni = row.getValue('dni') as string;
        return <div>{dni || '-'}</div>;
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
        const cliente = row.original;

        return (
          <div className="flex items-center gap-2">
            <Can I='update' a='cliente'>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(cliente)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Can>
            <Can I='delete' a='cliente'>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(cliente)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Can>
          </div>
        );
      },
    },
  ];

  const { table, pagination } = useTable<ClienteResponse, Cliente>({
    data,
    columns,
    key: 'clientes',
    onPageSizeChange,
    onPageChange
  })

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
        {
          isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Cargando clientes...</div>
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
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )
        }
      </div>

      <Pagination table={table} pagination={pagination} />
    </div>
  );
}
