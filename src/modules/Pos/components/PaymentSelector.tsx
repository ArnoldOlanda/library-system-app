import { FormaPago } from '../interfaces';

interface PaymentSelectorProps {
    formaPago: FormaPago;
    onChangeFormaPago: (formaPago: FormaPago) => void;
}

export function PaymentSelector({ formaPago, onChangeFormaPago }: PaymentSelectorProps) {
    const formasPago: FormaPago[] = ['Efectivo' as FormaPago, 'Tarjeta' as FormaPago, 'Transferencia' as FormaPago];

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pago</label>
            <div className="grid grid-cols-3 gap-2">
                {formasPago.map((forma) => (
                    <button
                        key={forma}
                        onClick={() => onChangeFormaPago(forma)}
                        className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                            formaPago === forma
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {forma}
                    </button>
                ))}
            </div>
        </div>
    );
}
