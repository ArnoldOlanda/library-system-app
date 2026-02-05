import { type ColumnDef, flexRender } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import type { Categoria, CategoryResponse } from '../interfaces';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/Pagination';
import type { TableProps } from '@/interfaces';
import { useTable } from '@/hooks/useTable';
import { Can } from '@/components/Can';

export function CategoriasTable({ 
  isLoading,
  data,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange 
}: TableProps<CategoryResponse, Categoria>) {

  const columns: ColumnDef<Categoria>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => <div className="font-medium">{row.getValue('nombre')}</div>,
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue('descripcion') || 'Sin descripción'}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <div>{date.toLocaleDateString('es-ES')}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const categoria = row.original;
        return (
          <div className="flex gap-2">
            <Can I='update' a='categoria'>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onEdit(categoria)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Can>
            <Can I='delete' a='categoria'>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => onDelete(categoria)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Can>
          </div>
        );
      },
    },
  ];

  const {table, pagination} = useTable<CategoryResponse, Categoria>({
    data,
    columns,
    key: 'categorias',
    onPageSizeChange,
    onPageChange
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por nombre..."
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
              <div className="text-muted-foreground">Cargando categorías...</div>
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
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
