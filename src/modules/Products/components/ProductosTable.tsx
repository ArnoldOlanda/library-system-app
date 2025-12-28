import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel,
  type PaginationState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
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
import type { Producto, ProductResponse } from '../interfaces';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TableProps } from '@/interfaces';
import { Pagination } from '@/components/Pagination';

export function ProductosTable({
  isLoading,
  data,
  onEdit,
  onDelete,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange
}: TableProps<ProductResponse, Producto>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: data ? data.offset - 1 : 0,
    pageSize: data?.limit || 10,
  });

  useEffect(() => {
    if (data) {
      setPagination({
        pageIndex: data.offset - 1,
        pageSize: data.limit,
      });
    }
  }, [data]);

  const columns: ColumnDef<Producto>[] = [
    {
      accessorKey: 'codigo',
      header: 'Código',
      cell: ({ row }) => <div className="font-medium">{row.getValue('codigo')}</div>,
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
    },
    {
      accessorKey: 'categoria.nombre',
      header: 'Categoría',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.categoria.nombre}</Badge>
      ),
    },
    {
      accessorKey: 'precioCompra',
      header: 'P. Compra',
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue('precioCompra'));
        return <div>S/. {precio.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: 'precioVenta',
      header: 'P. Venta',
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue('precioVenta'));
        return <div className="font-medium">S/. {precio.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => {
        const stock = row.getValue('stock') as number;
        const stockMinimo = row.original.stockMinimo;
        const isLow = stock <= stockMinimo;
        return (
          <Badge variant={isLow ? 'destructive' : 'secondary'}>
            {stock}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue('estado') as boolean;
        return (
          <Badge variant={estado ? 'default' : 'secondary'}>
            {estado ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const producto = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(producto)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => onDelete(producto)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.productos ?? [],
    columns,
    pageCount: data?.pages || 0,
    rowCount: data?.total || 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      if (newPagination.pageSize !== pagination.pageSize) {
        onPageSizeChange(newPagination.pageSize);
      }
      if (newPagination.pageIndex !== pagination.pageIndex) {
        onPageChange(newPagination.pageIndex + 1);
      }
    },
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por nombre o código..."
          value={search ?? ''}
          onChange={(event) =>{
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
              <div className="text-muted-foreground">Cargando productos...</div>
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

      <Pagination table={table} pagination={pagination}/>
    </div>
  );
}
