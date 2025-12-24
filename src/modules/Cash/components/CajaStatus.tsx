import type { Caja } from '../interfaces';

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
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">⚠️ No hay caja abierta</h3>
                <p className="text-sm">No existe una caja abierta para el día de hoy. Abre una caja para comenzar a operar.</p>
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-400 text-green-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">✓ Caja Abierta</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm font-semibold opacity-75">Fecha Apertura</p>
                    <p className="text-lg font-bold">
                        {new Date(caja.fechaArqueo).toLocaleDateString()}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Monto Inicial</p>
                    <p className="text-lg font-bold">${Number(caja.montoInicial).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Total Recaudado</p>
                    <p className="text-lg font-bold">${Number(caja.totalRecaudado).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Efectivo</p>
                    <p className="text-lg font-bold">${Number(caja.totalEfectivo).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Tarjeta</p>
                    <p className="text-lg font-bold">${Number(caja.totalTarjeta).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold opacity-75">Diferencia</p>
                    <p className={`text-lg font-bold ${Number(caja.diferencia) !== 0 ? 'text-red-600' : ''}`}>
                        ${Number(caja.diferencia).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
