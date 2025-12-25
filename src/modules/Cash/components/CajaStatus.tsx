import type { Caja } from '../interfaces';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';
interface CajaStatusProps {
    caja: Caja | null;
    loading: boolean;
}

export function CajaStatus({ caja, loading }: CajaStatusProps) {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <p className="text-center text-gray-500">Cargando estado de caja...</p>
            </div>
        );
    }

    if (!caja) {
        return (
            <Alert className='border-yellow-400 bg-yellow-50/50'>
                <TriangleAlert color='#d09311'/>
                <AlertTitle className='text-yellow-600'>No hay caja abierta</AlertTitle>
                <AlertDescription className='text-yellow-600'>
                No existe una caja abierta para el día de hoy. Abre una caja para comenzar a operar.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="bg-green-50/10 text-gray-800 p-2 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Caja del Día</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 md:grid-cols-4 sm:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm font-semibold opacity-75">Fecha Apertura</p>
                    <p className="font-bold">
                        {new Date(caja.fechaArqueo).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Monto Inicial</p>
                    <p className="font-bold">S/ {Number(caja.montoInicial).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Total Recaudado</p>
                    <p className="font-bold">S/ {Number(caja.totalRecaudado).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Efectivo</p>
                    <p className="font-bold">S/ {Number(caja.totalEfectivo).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Tarjeta</p>
                    <p className="font-bold">S/ {Number(caja.totalTarjeta).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Diferencia</p>
                    <p className={`text-lg font-bold ${Number(caja.diferencia) !== 0 ? 'text-red-600' : ''}`}>
                        S/ {Number(caja.diferencia).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
