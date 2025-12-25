import { Minus, Plus, X } from 'lucide-react';
import type { CartItem } from '../interfaces';

interface ShoppingCartProps {
    items: CartItem[];
    onUpdateQuantity: (productoId: string, cantidad: number) => void;
    onRemoveItem: (productoId: string) => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg">
                <p className="text-lg">El carrito está vacío</p>
                <p className="text-sm mt-1">Selecciona productos para agregar al carrito</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Unidad</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">P.U. (S/.)</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">P.T. (S/.)</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.producto.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">{item.producto.nombre}</div>
                                <div className="text-xs text-gray-500">Stock: {item.producto.stock}</div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">
                                UND
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onUpdateQuantity(item.producto.id, item.cantidad - 1)}
                                        disabled={item.cantidad <= 1}
                                        className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                        type="number"
                                        value={item.cantidad}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            onUpdateQuantity(item.producto.id, value);
                                        }}
                                        className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                                        min="1"
                                        max={item.producto.stock}
                                    />
                                    <button
                                        onClick={() => onUpdateQuantity(item.producto.id, item.cantidad + 1)}
                                        disabled={item.cantidad >= item.producto.stock}
                                        className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                {Number(item.producto.precioVenta).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                {item.subtotal.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => onRemoveItem(item.producto.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                                    title="Eliminar producto"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
