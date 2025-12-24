import { useState } from 'react';
import type { Caja, UpdateCajaDto } from '../interfaces';

interface CloseCajaFormProps {
    caja: Caja;
    onSubmit: (id: string, data: UpdateCajaDto) => Promise<void>;
    isSubmitting: boolean;
}

export function CloseCajaForm({ caja, onSubmit, isSubmitting }: CloseCajaFormProps) {
    const [totalEfectivo, setTotalEfectivo] = useState(caja.totalEfectivo.toString());
    const [totalTarjeta, setTotalTarjeta] = useState(caja.totalTarjeta.toString());

    const totalRecaudado = parseFloat(totalEfectivo || '0') + parseFloat(totalTarjeta || '0');
    const montoEsperado = Number(caja.montoInicial) + Number(caja.totalRecaudado);
    const diferencia = totalRecaudado - montoEsperado;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: UpdateCajaDto = {
            totalEfectivo: parseFloat(totalEfectivo),
            totalTarjeta: parseFloat(totalTarjeta),
            totalRecaudado,
            diferencia,
        };

        await onSubmit(caja.id, data);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Cerrar Caja</h3>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-600 font-semibold mb-2">Información de Caja</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-600">Monto Inicial:</span>
                        <span className="font-bold ml-2">${Number(caja.montoInicial).toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Ventas del Día:</span>
                        <span className="font-bold ml-2">${Number(caja.totalRecaudado).toFixed(2)}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-gray-600">Total Esperado:</span>
                        <span className="font-bold ml-2">${montoEsperado.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Total en Efectivo
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={totalEfectivo}
                            onChange={(e) => setTotalEfectivo(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Total en Tarjeta
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={totalTarjeta}
                            onChange={(e) => setTotalTarjeta(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div className={`p-4 rounded-lg ${diferencia === 0 ? 'bg-green-50 border border-green-400' : 'bg-red-50 border border-red-400'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Total Contado:</span>
                        <span className="text-lg font-bold">${totalRecaudado.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Diferencia:</span>
                        <span className={`text-lg font-bold ${diferencia !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${diferencia.toFixed(2)}
                        </span>
                    </div>
                    {diferencia !== 0 && (
                        <p className="text-sm text-red-600 mt-2">
                            {diferencia > 0 ? '⚠️ Hay un sobrante en caja' : '⚠️ Hay un faltante en caja'}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    {isSubmitting ? 'Cerrando...' : 'Cerrar Caja'}
                </button>
            </form>
        </div>
    );
}
