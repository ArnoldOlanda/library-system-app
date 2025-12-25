import { useState, useEffect } from 'react';
import { productosService } from '@/modules/Products/services/productos.service';
import type { Producto } from '@/modules/Products/interfaces';

interface ProductSearchProps {
    onSelectProduct: (producto: Producto) => void;
}

export function ProductSearch({ onSelectProduct }: ProductSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        setLoading(true);
        try {
            const data = await productosService.getAll(1, 100);
            setProductos(data);
            setFilteredProductos(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProductos(productos);
        } else {
            const filtered = productos.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProductos(filtered);
        }
    }, [searchTerm, productos]);

    const handleSelectProduct = (producto: Producto) => {
        onSelectProduct(producto);
        setSearchTerm('');
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    Buscar Producto (Nombre o Código)
                </label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar producto..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Cargando productos...</p>
            ) : (
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredProductos.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No se encontraron productos</p>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredProductos.map((producto) => (
                                <div
                                    key={producto.id}
                                    onClick={() => handleSelectProduct(producto)}
                                    className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
                                            <p className="text-sm text-gray-600">Código: {producto.codigo}</p>
                                            <p className="text-sm text-gray-600">
                                                Stock: {producto.stock} unidades
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-600">
                                                ${Number(producto.precioVenta).toFixed(2)}
                                            </p>
                                            {producto.stock <= producto.stockMinimo && (
                                                <span className="text-xs text-red-600 font-semibold">
                                                    Stock bajo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
