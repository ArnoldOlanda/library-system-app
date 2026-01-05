import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormaPago } from '../interfaces';

interface Props {
    onChangeFormaPago: (formaPago: FormaPago) => void;
}

export function PaymentSelector({ onChangeFormaPago }: Props) {
    const formasPago: FormaPago[] = [
        'Efectivo' as FormaPago, 
        'Tarjeta' as FormaPago, 
        // 'Transferencia' as FormaPago, 
        'Yape' as FormaPago, 
        'Plin' as FormaPago
    ];

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Forma de Pago</label>
            <div className="grid grid-cols-3 gap-2">
                <Select onValueChange={(value) => onChangeFormaPago(value as FormaPago)}>
                    <SelectTrigger className='w-70'>
                        <SelectValue placeholder="Selecciona un método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Formas de Pago</SelectLabel>
                            {formasPago.map((forma) => (
                                <SelectItem
                                    key={forma}
                                    value={forma}
                                    onClick={() => onChangeFormaPago(forma)}
                                >
                                    {forma}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
