import { useReporteCompras } from '../hooks/useReportes';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { format } from '@formkit/tempo';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ReporteCompras() {
    const { data, isLoading } = useReporteCompras();

    const handleExportExcel = () => {
        // TODO: Implementar exportación a Excel
        console.log('Exportar a Excel - Compras');
    };

    if (isLoading) {
        return (<div className='flex justify-center items-center'>
            Cargando reporte de compras...
        </div>)
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Contenido del reporte */}
            {data && (
                <div className="container mx-auto py-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                Reporte de Compras
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
                                <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/50">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Compras</p>
                                    <p className="text-2xl font-bold text-blue-600">{data.resumen.totalCompras}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg dark:bg-orange-900/50">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Monto Total</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        S/ {data.resumen.montoTotalCompras.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-900/50">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Compra</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        S/ {data.resumen.promedioCompra.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Tabla de compras */}
                            <div className="border rounded-lg overflow-hidden">
                                <Table className="w-full bg-card">
                                    <TableHeader className="border-b">
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Proveedor</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y">
                                        {data.compras.map((compra) => (
                                            <TableRow key={compra.id}>
                                                <TableCell>
                                                    {format(new Date(compra.fechaCompra), 'DD/MM/YYYY HH:mm', 'es')}
                                                </TableCell>
                                                <TableCell>
                                                    {compra.proveedor?.nombre || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{compra.detalles.length}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    S/ {Number(compra.total).toFixed(2)}
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
