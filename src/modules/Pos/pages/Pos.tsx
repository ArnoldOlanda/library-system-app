import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, BrushCleaning, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCaja } from '@/modules/Cash/hooks/useCaja';
import { usePOS } from '../hooks/usePOS';
import { ProductSearch } from '../components/ProductSearch';
import { ShoppingCart } from '../components/ShoppingCart';
import { PaymentSelector } from '../components/PaymentSelector';
import { CustomerSearch } from '../components/CustomerSearch';
import type { Producto } from '@/modules/Products/interfaces';
import type { Cliente } from '@/modules/Customers/interfaces';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { Button } from '@/components/ui/button';

export function PosPage() {
  const { openCaja, loading: cajaLoading, error: cajaError } = useCaja();
  const {
    cart,
    isProcessing,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setFormaPago,
    setSelectedCliente,
    processSale,
  } = usePOS();

  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSelectProduct = (producto: Producto) => {
    addToCart(producto, 1);
  };

  const handleSelectCustomer = (customer: Cliente | null) => {
    setSelectedCustomer(customer);
    setSelectedCliente(customer?.id);
  };

  const handleProcessSale = async () => {
    const result = await processSale();
    if (result) {
      toast.success('Venta procesada exitosamente', {
        position: 'top-center',
      });
      setSelectedCustomer(null);
      setShowConfirmDialog(false);
    }
  };

  // IGV Calculations (18%)
  const IGV_RATE = 0.18;
  const subtotal = cart.total / (1 + IGV_RATE);
  const igv = cart.total - subtotal;
  const total = cart.total;

  if (cajaLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Verificando caja abierta...</p>
      </div>
    );
  }

  if (cajaError || !openCaja) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center justify-center max-w-md text-center space-y-6">
          <div className="bg-red-100 p-6 rounded-full">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-red-600">Caja Cerrada</h1>
            <p className="text-lg text-muted-foreground">
              No hay una caja abierta para el día de hoy.
            </p>
            <p className="text-sm text-muted-foreground">
              Debe abrir una caja antes de poder realizar ventas.
            </p>
          </div>
          <Link
            to="/caja"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Ir a Gestión de Caja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Caja Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Punto de Venta</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Caja abierta</span>
            <span className="text-gray-400">•</span>
            <span>{new Date(openCaja.fechaArqueo).toLocaleDateString()}</span>
            <span className="text-gray-400">•</span>
            <span>Inicial: S/{Number(openCaja.montoInicial).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information Section */}
      <div className="border rounded-lg p-5 bg-card">
        <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomerSearch
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleSelectCustomer}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha de Emisión
              </label>
              <Input
                type="text"
                value={new Date().toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <PaymentSelector
                onChangeFormaPago={setFormaPago}
              />
            </div>
          </div>
        </div>
        {/* Selected Customer Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2 rounded-lg">
          <div>
            <label className="text-sm font-medium block mb-1">Nombre</label>
            <Input
              value={selectedCustomer?.nombre}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">DNI</label>
            <Input
              value={selectedCustomer?.dni || ''}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Teléfono</label>
            <Input
              value={selectedCustomer?.telefono || ''}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Dirección</label>
            <Input
              value={selectedCustomer?.direccion || ''}
              readOnly
              className="bg-white"
            />
          </div>
        </div>
      </div>

      {/* Product Search and Cart Section */}
      <div className="border rounded-lg p-5 bg-card">
        <h2 className="text-lg font-semibold mb-4">Productos</h2>

        {/* Product Search */}
        <div className="mb-4">
          <ProductSearch onSelectProduct={handleSelectProduct} />
        </div>

        {/* Shopping Cart Table */}
        <ShoppingCart
          items={cart.items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
        />

        {/* Summary and Actions */}
        {cart.items.length > 0 && (
          <div className="mt-6 flex justify-between items-end">
            <div className="flex gap-3">
              <Button
                onClick={clearCart}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg font-medium text-gray-700 transition-colors"
              >
                <BrushCleaning />
                Limpiar
              </Button>
            </div>

            <div className="flex flex-col items-end gap-3">
              {/* Financial Summary */}
              <div className="border rounded-lg p-4 min-w-70">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="">Subtotal:</span>
                    <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="">IGV (18%):</span>
                    <span className="font-semibold">S/ {igv.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-xl">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Process Sale Button */}
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isProcessing}
                className={`px-8 py-3 rounded-lg font-semibold text-base transition-all ${isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 dark:bg-green-800 dark:hover:bg-green-900 text-white shadow-md hover:shadow-lg'
                  }`}
              >
                {isProcessing ? 'Procesando...' : 'Procesar Venta'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        setOpen={setShowConfirmDialog}
        title="Confirmar Venta"
        description={
          <div className="space-y-2">
            <p>¿Está seguro de que desea procesar esta venta?</p>
            <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-md text-sm">
              <div className="flex justify-between">
                <span>Total de items:</span>
                <span className="font-semibold">{cart.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total a cobrar:</span>
                <span className="font-semibold text-lg">S/ {total.toFixed(2)}</span>
              </div>
              {selectedCustomer && (
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <span>Cliente:</span>
                  <span className="font-semibold">{selectedCustomer.nombre}</span>
                </div>
              )}
            </div>
          </div>
        }
        confirmText="Procesar Venta"
        cancelText="Cancelar"
        onConfirm={handleProcessSale}
      />
    </div>
  );
}
