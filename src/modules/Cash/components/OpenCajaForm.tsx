import { useState } from 'react';
import type { CreateCajaDto } from '../interfaces';

interface OpenCajaFormProps {
    onSubmit: (data: CreateCajaDto) => Promise<void>;
    isSubmitting: boolean;
}

export function OpenCajaForm({ onSubmit, isSubmitting }: OpenCajaFormProps) {
    const [montoInicial, setMontoInicial] = useState('100.00');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: CreateCajaDto = {
            fechaArqueo: new Date().toISOString(),
            montoInicial: parseFloat(montoInicial),
            totalRecaudado: 0,
            totalEfectivo: 0,
            totalTarjeta: 0,
            diferencia: 0,
        };

        await onSubmit(data);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Abrir Caja</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Monto Inicial
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={montoInicial}
                            onChange={(e) => setMontoInicial(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Ingresa el monto con el que inicias la caja
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {isSubmitting ? 'Abriendo...' : 'Abrir Caja'}
                </button>
            </form>
        </div>
    );
}
