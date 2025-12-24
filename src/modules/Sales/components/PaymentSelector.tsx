import { FormaPago } from '../interfaces';

interface PaymentSelectorProps {
    formaPago: FormaPago;
    onChangeFormaPago: (formaPago: FormaPago) => void;
    total: number;
}

export function PaymentSelector({ formaPago, onChangeFormaPago, total }: PaymentSelectorProps) {
    const formasPago: FormaPago[] = ['Efectivo' as FormaPago, 'Tarjeta' as FormaPago, 'Transferencia' as FormaPago];

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Forma de Pago</label>
                <div className="grid grid-cols-3 gap-2">
                    {formasPago.map((forma) => (
                        <button
                            key={forma}
                            onClick={() => onChangeFormaPago(forma)}
                            className={`px-4 py-3 rounded-lg font-semibold transition-colors ${formaPago === forma
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {forma}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <p className="text-sm opacity-90 mb-1">Total a Pagar</p>
                <p className="text-4xl font-bold">${total.toFixed(2)}</p>
            </div>
        </div>
    );
}
