import {type ColumnDef, flexRender } from '@tanstack/react-table';
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
import { Pencil, QrCode, Trash2, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TableProps } from '@/interfaces';
import { Pagination } from '@/components/Pagination';
import { useTable } from '@/hooks/useTable';
import { QrCodeScannerDialog } from '@/components/dialogs/QrCodeScannerDialog';
import { useEffect, useState } from 'react';
import { socketService, type NewProductScannedEvent } from '@/services/socketService';
import { toast } from 'sonner';
import { useProductStore } from '../store/productStore';

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

  const setBarCodeScanned = useProductStore((state) => state.setBarCodeScanned);

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

  const {pagination, table} = useTable<ProductResponse, Producto>({
    data,
    columns,
    key: 'productos',
    onPageSizeChange,
    onPageChange
  });

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [posSessionId, setPosSessionId] = useState<string>('');

  // Conectar WebSocket para recibir productos escaneados
  useEffect(() => {
    // Generar sessionId único para este dispositivo, primero obtenerlo del localStorage si existe
    let storedSessionId = localStorage.getItem('scanner-session-id');
    
    if (storedSessionId) {
      console.log({storedSessionId});
      setPosSessionId(storedSessionId);
    } else {
      storedSessionId = `pos-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setPosSessionId(storedSessionId);
      localStorage.setItem('scanner-session-id', storedSessionId);
    }
    
    console.log('🔌 Conectando Inventario al WebSocket con sessionId:', storedSessionId);
    const socket = socketService.connect('pos', storedSessionId);
    
    // Esperar a que el socket esté conectado
    const waitForConnection = () => {
      if (socket.connected) {
        console.log('✅ Inventario conectado y listo para recibir codigos de barras');
        setIsSocketConnected(true);
      } else {
        setTimeout(waitForConnection, 100);
      }
    };
    waitForConnection();

    const handleNewProductScanned = (data: NewProductScannedEvent) => {
      console.log('📦 Nuevo producto escaneado en Inventario:', data);
      setBarCodeScanned(data.barcode);
      toast.success(`Codigo de barras scaneado: ${data.barcode}`, {
        position: 'bottom-right',
        duration: 2000,
      });
    };

    socketService.onNewProductScanned(handleNewProductScanned);

    // Verificar estado de conexión cada 2 segundos
    const interval = setInterval(() => {
      setIsSocketConnected(socketService.isConnected());
    }, 2000);

    return () => {
      clearInterval(interval);
      socketService.offNewProductScanned(handleNewProductScanned);
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Buscar por nombre o código..."
          value={search ?? ''}
          onChange={(event) =>{
            const value = event.target.value;
            onSearchChange(value || undefined);
          }}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowQRDialog(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            Vincular Escáner
          </Button>
          <Badge variant={isSocketConnected ? 'default' : 'secondary'} className="flex items-center gap-1">
            {isSocketConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isSocketConnected ? 'Escáner Conectado' : 'Escáner Desconectado'}
          </Badge>
        </div>
      </div>

      <QrCodeScannerDialog 
        show={showQRDialog}
        sessionId={posSessionId} 
        setShow={(show:boolean)=>setShowQRDialog(show)}
      />

      <div className="rounded-md border">
        {
          isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Cargando productos...</div>
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

      <Pagination table={table} pagination={pagination}/>
    </div>
  );
}
