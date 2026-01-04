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
import { Badge } from '@/components/ui/badge';
import type { Venta, VentaResponse } from '../../Pos/interfaces';
import { Ban, Eye } from 'lucide-react';
import { format } from '@formkit/tempo';
import { TableButtonAction } from '@/components/TableButtonAction';
import type { TableProps } from '@/interfaces';
import { useTable } from '@/hooks/useTable';
import { Pagination } from '@/components/Pagination';


export function VentasTable({ 
  isLoading,
  data, 
  onView, 
  onDelete,
  search,
  onSearchChange,
  onPageChange,
  onPageSizeChange 
}: TableProps<VentaResponse, Venta>) {
  
  const columns: ColumnDef<Venta>[] = [
    {
      accessorKey: 'fechaVenta',
      header: 'Fecha',
      cell: ({ row }) => {
        const fecha = new Date(row.getValue('fechaVenta'));
        return (
          <div className="text-sm">
            {format(fecha, 'DD/MM/YYYY HH:mm', 'es')}
          </div>
        );
      },
    },
    {
      id: 'cliente',
      accessorFn: (row) => row.cliente?.nombre || 'Consumidor Final',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.cliente?.nombre || 'Consumidor Final'}
        </div>
      ),
    },
    {
      id: 'documento',
      accessorFn: (row) => row.cliente?.dni || '-',
      header: 'Documento',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.cliente?.dni || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'formaPago',
      header: 'Pago',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('formaPago')}</Badge>
      ),
    },
    {
      accessorKey: 'detalles',
      header: 'Items',
      cell: ({ row }) => {
        const detalles = row.getValue('detalles') as Venta['detalles'];
        return (
          <Badge variant="secondary">
            {detalles.length} {detalles.length === 1 ? 'producto' : 'productos'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => {
        const total = parseFloat(row.getValue('total'));
        return (
          <div className="text-right font-semibold">
            S/ {total.toFixed(2)}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const venta = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onView && onView(venta)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <TableButtonAction 
              variant='destructive'
              icon={<Ban className="h-4 w-4" />}
              tooltipText='Anular Venta'
              onClick={() => onDelete(venta)}
            />
          </div>
        );
      },
    },
  ];

  const {pagination, table} = useTable<VentaResponse, Venta>({
    data,
    columns,
    key: 'ventas',
    onPageChange,
    onPageSizeChange,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filtrar por cliente..."
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
              <div className="text-muted-foreground">Cargando ventas...</div>
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
          )
        }

      </div>

      <Pagination table={table} pagination={pagination}/>
    </div>
  );
}
