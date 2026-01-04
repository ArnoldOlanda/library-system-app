import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../interfaces';
import { TableButtonAction } from '@/components/TableButtonAction';
import { Button } from '@/components/ui/button';

interface ShoppingCartProps {
    items: CartItem[];
    onUpdateQuantity: (productoId: string, cantidad: number) => void;
    onRemoveItem: (productoId: string) => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg">
                <p className="text-lg">El carrito está vacío</p>
                <p className="text-sm mt-1">Selecciona productos para agregar al carrito</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="border-b border-gray-300">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Producto</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Unidad</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Cantidad</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">P.U. (S/.)</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">P.T. (S/.)</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.producto.id} className="transition-colors">
                            <td className="px-4 py-3">
                                <div className="font-medium">{item.producto.nombre}</div>
                                <div className="text-xs">Stock: {item.producto.stock}</div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                                UND
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        onClick={() => onUpdateQuantity(item.producto.id, item.cantidad - 1)}
                                        disabled={item.cantidad <= 1}
                                        size='icon'
                                        className="w-7 h-7 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
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
                                    <Button
                                        onClick={() => onUpdateQuantity(item.producto.id, item.cantidad + 1)}
                                        disabled={item.cantidad >= item.producto.stock}
                                        size='icon'
                                        className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                                {Number(item.producto.precioVenta).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-bold">
                                {item.subtotal.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <TableButtonAction 
                                    variant="destructive"
                                    onClick={() => onRemoveItem(item.producto.id)}
                                    tooltipText="Eliminar producto"
                                    icon={<Trash2 className="h-4 w-4" />}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
