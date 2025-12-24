import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Compra } from '../interfaces';
import { format } from '@formkit/tempo';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CompraDetalleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compra: Compra | null;
}

export function CompraDetalleDialog({
  open,
  onOpenChange,
  compra,
}: CompraDetalleDialogProps) {
  if (!compra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalle de Compra</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-semibold">{compra.proveedor.nombre}</p>
              {compra.proveedor.contacto && (
                <p className="text-sm text-muted-foreground">
                  {compra.proveedor.contacto}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Compra</p>
              <p className="font-semibold">
                {format(new Date(compra.fechaCompra), 'DD/MM/YYYY', 'es')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Productos</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compra.detalles.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell className="font-mono text-sm">
                        {detalle.producto.codigo}
                      </TableCell>
                      <TableCell>{detalle.producto.nombre}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{detalle.cantidad}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        S/ {Number(detalle.precioUnitario).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        S/ {(detalle.cantidad * Number(detalle.precioUnitario)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">
                S/ {Number(compra.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
