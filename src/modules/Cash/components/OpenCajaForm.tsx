import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CreateCajaDto } from '../interfaces';

const openCajaSchema = z.object({
  montoInicial: z.string().min(1, 'El monto inicial es requerido'),
});

interface OpenCajaFormProps {
  onSubmit: (data: CreateCajaDto) => Promise<void>;
  isSubmitting: boolean;
}

export function OpenCajaForm({ onSubmit, isSubmitting }: OpenCajaFormProps) {
  const form = useForm<z.infer<typeof openCajaSchema>>({
    resolver: zodResolver(openCajaSchema),
    defaultValues: {
      montoInicial: '100',
    },
  });

  const handleSubmit = async (formData: z.infer<typeof openCajaSchema>) => {
    const montoInicial = parseFloat(formData.montoInicial);
    
    if (isNaN(montoInicial) || montoInicial <= 0) {
      form.setError('montoInicial', {
        message: 'El monto debe ser mayor a 0',
      });
      return;
    }

    const data: CreateCajaDto = {
      fechaArqueo: new Date().toISOString(),
      montoInicial,
      totalRecaudado: 0,
      totalEfectivo: 0,
      totalTarjeta: 0,
      diferencia: 0,
      open: true,
    };

    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="montoInicial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto Inicial</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    S/
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Ingresa el monto con el que inicias la caja
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Abriendo...' : 'Confirmar Apertura de Caja'}
        </Button>
      </form>
    </Form>
  );
}
