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
import type { Compra, CompraResponse } from '../interfaces';
import { Eye, Trash2 } from 'lucide-react';
import { format } from '@formkit/tempo';
import type { TableProps } from '@/interfaces';
import { useTable } from '@/hooks/useTable';
import { Pagination } from '@/components/Pagination';


export function ComprasTable({ 
  isLoading,
  data, 
  onView, 
  onDelete,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  search, 
}: TableProps<CompraResponse, Compra>) {
  
  const columns: ColumnDef<Compra>[] = [
    {
      accessorKey: 'fechaCompra',
      header: 'Fecha',
      cell: ({ row }) => {
        const fecha = new Date(row.getValue('fechaCompra'));
        return (
          <div className="text-sm">
            {format(fecha, 'DD/MM/YYYY', 'es')}
          </div>
        );
      },
    },
    {
      id: 'proveedor',
      accessorFn: (row) => row.proveedor.nombre,
      header: 'Proveedor',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.proveedor.nombre}</div>
      ),
    },
    {
      accessorKey: 'detalles',
      header: 'Items',
      cell: ({ row }) => {
        const detalles = row.getValue('detalles') as Compra['detalles'];
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
        const compra = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onView && onView(compra)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(compra)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const {pagination, table} = useTable<CompraResponse, Compra>({
    key: 'compras',
    data,
    columns,
    onPageChange,
    onPageSizeChange,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filtrar por proveedor..."
          value={search ?? ''}
          onChange={(event) =>{
            const value = event.target.value;
            onSearchChange(value || undefined);
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        { isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Cargando compras...</div>
          </div>
          ):(
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

      <Pagination table={table} pagination={pagination}/>
    </div>
  );
}
