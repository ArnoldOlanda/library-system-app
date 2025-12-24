import { useState } from 'react';
import { useCaja } from '@/modules/Cash/hooks/useCaja';
import { usePOS } from '../hooks/usePOS';
import { ProductSearch } from '../components/ProductSearch';
import { ShoppingCart } from '../components/ShoppingCart';
import { PaymentSelector } from '../components/PaymentSelector';
import type { Producto } from '@/modules/Products/interfaces';

export function Ventas() {
  const { openCaja, loading: cajaLoading, error: cajaError } = useCaja();
  const {
    cart,
    formaPago,
    isProcessing,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setFormaPago,
    processSale,
  } = usePOS();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectProduct = (producto: Producto) => {
    addToCart(producto, 1);
  };

  const handleProcessSale = async () => {
    const result = await processSale();
    if (result) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (cajaLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Verificando caja abierta...</p>
      </div>
    );
  }

  if (cajaError || !openCaja) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Caja Cerrada</h1>
        <p className="text-muted-foreground mb-4">
          No hay una caja abierta para el día de hoy.
        </p>
        <p className="text-sm text-muted-foreground">
          Debe abrir una caja antes de poder realizar ventas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Punto de Venta (POS)</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">✓ Caja Abierta</p>
          <p className="text-sm">
            Fecha: {new Date(openCaja.fechaArqueo).toLocaleDateString()} |
            Monto Inicial: ${Number(openCaja.montoInicial).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-pulse">
          <p className="text-lg font-bold">✓ Venta procesada exitosamente</p>
        </div>
      )}

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Search */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Productos</h2>
            <ProductSearch onSelectProduct={handleSelectProduct} />
          </div>
        </div>

        {/* Right Column - Cart and Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shopping Cart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Carrito ({cart.itemCount} {cart.itemCount === 1 ? 'artículo' : 'artículos'})
              </h2>
              {cart.items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Limpiar Carrito
                </button>
              )}
            </div>
            <ShoppingCart
              items={cart.items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
            />
          </div>

          {/* Payment Section */}
          {cart.items.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Pago</h2>
              <PaymentSelector
                formaPago={formaPago}
                onChangeFormaPago={setFormaPago}
                total={cart.total}
              />

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleProcessSale}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {isProcessing ? 'Procesando...' : 'Procesar Venta'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={clearCart}
                    disabled={isProcessing}
                    className="py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled
                    className="py-3 bg-blue-100 text-blue-400 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Imprimir Recibo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {cart.items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Artículos</p>
            <p className="text-2xl font-bold text-blue-900">{cart.itemCount}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold">Forma de Pago</p>
            <p className="text-2xl font-bold text-purple-900">{formaPago}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold">Total</p>
            <p className="text-2xl font-bold text-green-900">${cart.total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
