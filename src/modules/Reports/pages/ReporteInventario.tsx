import { FileSpreadsheet } from 'lucide-react';
import { useReporteInventario } from '../hooks/useReportes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ReporteInventario() {
    const { data, isLoading } = useReporteInventario();

    const handleExportExcel = () => {
        window.open('http://localhost:3000/api/v1/reportes/inventario/pdf');
    };

    if (isLoading) {
        return (<div className='flex justify-center items-center'>
            Cargando reporte de inventario...
        </div>)
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Contenido del reporte */}
            {data && (
                <div className='space-y-6'>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                Reporte de Inventario
                            </h1>
                        </div>
                        <Button onClick={handleExportExcel} className='bg-green-700 hover:bg-green-800 text-white' size="sm">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Exportar a Excel
                        </Button>
                    </div>
                    <div>
                        <div className="space-y-4">
                            {/* Resumen */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Productos</p>
                                    <p className="text-2xl font-bold text-blue-500">{data.resumen.totalProductos}</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Productos Bajo Stock</p>
                                    <p className="text-2xl font-bold text-red-500">{data.resumen.productosBajoStock}</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Valor Total Inventario</p>
                                    <p className="text-2xl font-bold text-green-500">
                                        S/ {data.resumen.valorTotalInventario.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Tabla de productos */}
                            <div className="border rounded-lg overflow-hidden">
                                <Table className="w-full bg-card">
                                    <TableHeader className="border-b">
                                        <TableRow>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>P. Compra</TableHead>
                                            <TableHead>P. Venta</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y">
                                        {data.productos.map((producto) => (
                                            <TableRow key={producto.id}>
                                                <TableCell>{producto.codigo}</TableCell>
                                                <TableCell>{producto.nombre}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{producto.categoria.nombre}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={producto.stock <= producto.stockMinimo ? 'destructive' : 'secondary'}>
                                                        {producto.stock}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>S/ {Number(producto.precioCompra).toFixed(2)}</TableCell>
                                                <TableCell>S/ {Number(producto.precioVenta).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={producto.estado ? 'default' : 'secondary'}>
                                                        {producto.estado ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
