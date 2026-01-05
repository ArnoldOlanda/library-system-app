import type { Caja } from '../interfaces';

interface CajaHistoryTableProps {
    arqueos: Caja[];
    loading: boolean;
}

export function CajaHistoryTable({ arqueos, loading }: CajaHistoryTableProps) {
    if (loading) {
        return (
            <div className="p-6 rounded-lg shadow-md border border-gray-200">
                <p className="text-center text-gray-500">Cargando historial...</p>
            </div>
        );
    }

    if (arqueos.length === 0) {
        return (
            <div className="p-6 rounded-lg shadow-md border border-gray-200">
                <p className="text-center text-gray-500">No hay arqueos registrados</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg shadow-md border overflow-hidden bg-card">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Monto Inicial
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total Recaudado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Efectivo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Tarjeta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Diferencia
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {arqueos.map((arqueo) => (
                            <tr key={arqueo.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {new Date(arqueo.fechaArqueo).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    S/ {Number(arqueo.montoInicial).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    S/ {Number(arqueo.totalRecaudado).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    S/ {Number(arqueo.totalEfectivo).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    S/ {Number(arqueo.totalTarjeta).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`font-semibold ${Number(arqueo.diferencia) === 0
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                            }`}
                                    >
                                        S/ {Number(arqueo.diferencia).toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
