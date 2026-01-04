import { useState, useEffect } from 'react';
import { ChevronsUpDown, Package } from 'lucide-react';
import { productosService } from '@/modules/Products/services/productos.service';
import type { Producto } from '@/modules/Products/interfaces';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface ProductSearchProps {
    onSelectProduct: (producto: Producto) => void;
}

export function ProductSearch({ onSelectProduct }: ProductSearchProps) {
    const [open, setOpen] = useState(false);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        setLoading(true);
        try {
            const data = await productosService.getAll(1, 100);
            setProductos(data.productos.filter(p => p.estado && p.stock > 0));
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProduct = (producto: Producto) => {
        onSelectProduct(producto);
        setOpen(false);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">
                Buscar Producto
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>Seleccionar producto...</span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-125 p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar por nombre o código..." />
                        <CommandList>
                            <CommandEmpty>
                                {loading ? "Cargando productos..." : "No se encontraron productos"}
                            </CommandEmpty>
                            <CommandGroup>
                                {productos.map((producto) => (
                                    <CommandItem
                                        key={producto.id}
                                        value={`${producto.nombre} ${producto.codigo}`}
                                        onSelect={() => handleSelectProduct(producto)}
                                        className="flex items-center justify-between py-3"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{producto.nombre}</span>
                                                {producto.stock <= producto.stockMinimo && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Stock bajo
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                                                <span>Código: {producto.codigo}</span>
                                                <span>Stock: {producto.stock}</span>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="font-bold text-blue-600">
                                                S/ {Number(producto.precioVenta).toFixed(2)}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
