import type { CartItem } from '../interfaces';

interface ShoppingCartProps {
    items: CartItem[];
    onUpdateQuantity: (productoId: string, cantidad: number) => void;
    onRemoveItem: (productoId: string) => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="text-lg">El carrito está vacío</p>
                <p className="text-sm">Selecciona productos para agregar al carrito</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <div
                    key={item.producto.id}
                    className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
                >
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.producto.nombre}</h4>
                        <p className="text-sm text-gray-600">
                            ${Number(item.producto.precioVenta).toFixed(2)} c/u
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpdateQuantity(item.producto.id, item.cantidad - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                            disabled={item.cantidad <= 1}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                onUpdateQuantity(item.producto.id, value);
                            }}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                            min="1"
                            max={item.producto.stock}
                        />
                        <button
                            onClick={() => onUpdateQuantity(item.producto.id, item.cantidad + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                            disabled={item.cantidad >= item.producto.stock}
                        >
                            +
                        </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                        <p className="font-bold text-gray-900">
                            ${item.subtotal.toFixed(2)}
                        </p>
                    </div>

                    <button
                        onClick={() => onRemoveItem(item.producto.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
