import { useReporteVentas } from '../hooks/useReportes';
import { FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from '@formkit/tempo';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ReporteVentas() {
    const { data, isLoading } = useReporteVentas();

    const handleExportExcel = () => {
        // TODO: Implementar exportación a Excel
        console.log('Exportar a Excel - Ventas');
    };

    if (isLoading) {
        return (<div className='flex justify-center items-center'>
            Cargando reporte de ventas...
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
                                Reporte de Ventas
                            </h1>
                        </div>
                        <Button onClick={handleExportExcel} className='bg-green-700 hover:bg-green-800 text-white' size="sm">
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Exportar a Excel
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {/* Resumen */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Ventas</p>
                                <p className="text-2xl font-bold text-blue-600">{data.resumen.totalVentas}</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Monto Total</p>
                                <p className="text-2xl font-bold text-green-600">
                                    S/ {data.resumen.montoTotalVentas.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Venta</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    S/ {data.resumen.promedioVenta.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Ventas por forma de pago */}
                        <div className="p-4 rounded-lg">
                            <h3 className="text-sm font-medium mb-2">Ventas por Forma de Pago</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(data.resumen.ventasPorFormaPago).map(([forma, cantidad]) => (
                                    <Badge key={forma} variant="outline">
                                        {forma}: {cantidad}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Tabla de ventas */}
                        <div className="border rounded-lg overflow-hidden">
                            <Table className="w-full bg-card">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Forma Pago</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y">
                                    {data.ventas.map((venta) => (
                                        <TableRow key={venta.id}>
                                            <TableCell>
                                                {format(new Date(venta.fechaVenta), 'DD/MM/YYYY HH:mm', 'es')}
                                            </TableCell>
                                            <TableCell>
                                                {venta.cliente?.nombre || 'Consumidor Final'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{venta.formaPago}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{venta.detalles.length}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                S/ {Number(venta.total).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
