import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Caja, UpdateCajaDto } from '../interfaces';

const closeCajaSchema = z.object({
  totalEfectivo: z.string(),
  totalTarjeta: z.string(),
});

interface CloseCajaFormProps {
  caja: Caja;
  onSubmit: (id: string, data: UpdateCajaDto) => Promise<void>;
  isSubmitting: boolean;
}

export function CloseCajaForm({ caja, onSubmit, isSubmitting }: CloseCajaFormProps) {
  const form = useForm<z.infer<typeof closeCajaSchema>>({
    resolver: zodResolver(closeCajaSchema),
    defaultValues: {
      totalEfectivo: caja.totalEfectivo.toString(),
      totalTarjeta: caja.totalTarjeta.toString(),
    },
  });

  const watchEfectivo = form.watch('totalEfectivo');
  const watchTarjeta = form.watch('totalTarjeta');

  const totalEfectivo = parseFloat(watchEfectivo || '0');
  const totalTarjeta = parseFloat(watchTarjeta || '0');
  const totalRecaudado = totalEfectivo + totalTarjeta;
  const montoEsperado = Number(caja.montoInicial) + Number(caja.totalRecaudado);
  const diferencia = totalRecaudado - montoEsperado;

  const handleSubmit = async (formData: z.infer<typeof closeCajaSchema>) => {
    const efectivo = parseFloat(formData.totalEfectivo || '0');
    const tarjeta = parseFloat(formData.totalTarjeta || '0');

    if (isNaN(efectivo) || efectivo < 0) {
      form.setError('totalEfectivo', {
        message: 'El monto debe ser mayor o igual a 0',
      });
      return;
    }

    if (isNaN(tarjeta) || tarjeta < 0) {
      form.setError('totalTarjeta', {
        message: 'El monto debe ser mayor o igual a 0',
      });
      return;
    }

    const data: UpdateCajaDto = {
      totalEfectivo: efectivo,
      totalTarjeta: tarjeta,
      totalRecaudado: efectivo + tarjeta,
      diferencia: (efectivo + tarjeta) - montoEsperado,
      open: false,
    };

    await onSubmit(caja.id, data);
  };

  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-blue-600 font-semibold mb-2">Información de Caja</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Monto Inicial:</span>
            <span className="font-bold ml-2">S/ {Number(caja.montoInicial).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Ventas del Día:</span>
            <span className="font-bold ml-2">S/ {Number(caja.totalRecaudado).toFixed(2)}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Total Esperado:</span>
            <span className="font-bold ml-2">S/ {montoEsperado.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="totalEfectivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total en Efectivo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      S/
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalTarjeta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total en Tarjeta</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      S/
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={`p-4 rounded-lg ${
              diferencia === 0
                ? 'bg-green-50 border border-green-400'
                : 'bg-red-50 border border-red-400'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Contado:</span>
              <span className="text-lg font-bold">S/ {totalRecaudado.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Diferencia:</span>
              <span
                className={`text-lg font-bold ${
                  diferencia !== 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                S/ {diferencia.toFixed(2)}
              </span>
            </div>
            {diferencia !== 0 && (
              <p className="text-sm text-red-600 mt-2">
                {diferencia > 0
                  ? '⚠️ Hay un sobrante en caja'
                  : '⚠️ Hay un faltante en caja'}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="destructive"
            className="w-full"
          >
            {isSubmitting ? 'Cerrando...' : 'Confirmar Cierre de Caja'}
          </Button>
        </form>
      </Form>
    </>
  );
}
