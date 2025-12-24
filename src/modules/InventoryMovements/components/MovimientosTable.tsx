import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
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
import { Badge } from '@/components/ui/badge';
import type { MovimientoAlmacen, TipoMovimiento, OrigenMovimiento } from '../interfaces';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { format } from '@formkit/tempo';

interface MovimientosTableProps {
  data: MovimientoAlmacen[];
}

const getTipoVariant = (tipo: TipoMovimiento) => {
  switch (tipo) {
    case 'Entrada':
    case 'Ajuste Entrada':
      return 'default';
    case 'Salida':
    case 'Ajuste Salida':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getOrigenVariant = (origen: OrigenMovimiento) => {
  switch (origen) {
    case 'Compra':
      return 'default';
    case 'Venta':
      return 'secondary';
    case 'Ajuste Manual':
      return 'outline';
    default:
      return 'secondary';
  }
};

export function MovimientosTable({ data }: MovimientosTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<MovimientoAlmacen>[] = [
    {
      accessorKey: 'fechaMovimiento',
      header: 'Fecha',
      cell: ({ row }) => {
        const fecha = new Date(row.getValue('fechaMovimiento'));
        return (
          <div className="text-sm">
            {format(fecha, 'DD/MM/YYYY HH:mm', 'es')}
          </div>
        );
      },
    },
    {
      accessorKey: 'producto.codigo',
      header: 'Código',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.producto.codigo}</div>
      ),
    },
    {
      accessorKey: 'producto.nombre',
      header: 'Producto',
      cell: ({ row }) => (
        <div className="max-w-50 truncate">
          {row.original.producto.nombre}
        </div>
      ),
    },
    {
      accessorKey: 'tipoMovimiento',
      header: 'Tipo',
      cell: ({ row }) => {
        const tipo = row.getValue('tipoMovimiento') as TipoMovimiento;
        const isEntrada = tipo === 'Entrada' || tipo === 'Ajuste Entrada';
        return (
          <Badge variant={getTipoVariant(tipo)} className="gap-1">
            {isEntrada ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {tipo}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'origenMovimiento',
      header: 'Origen',
      cell: ({ row }) => {
        const origen = row.getValue('origenMovimiento') as OrigenMovimiento;
        return <Badge variant={getOrigenVariant(origen)}>{origen}</Badge>;
      },
    },
    {
      accessorKey: 'cantidad',
      header: 'Cantidad',
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.getValue('cantidad')}</div>
      ),
    },
    {
      accessorKey: 'stockAnterior',
      header: 'Stock Anterior',
      cell: ({ row }) => (
        <div className="text-center text-muted-foreground">
          {row.getValue('stockAnterior')}
        </div>
      ),
    },
    {
      accessorKey: 'stockNuevo',
      header: 'Stock Nuevo',
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.getValue('stockNuevo')}</div>
      ),
    },
    {
      accessorKey: 'usuario',
      header: 'Usuario',
      cell: ({ row }) => {
        const usuario = row.original.usuario;
        return (
          <div className="text-sm">
            {usuario.firstName} {usuario.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: 'observaciones',
      header: 'Observaciones',
      cell: ({ row }) => {
        const obs = row.getValue('observaciones') as string;
        return obs ? (
          <div className="max-w-37.5 truncate text-sm text-muted-foreground" title={obs}>
            {obs}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filtrar por producto..."
          value={(table.getColumn('producto.nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('producto.nombre')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

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
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
