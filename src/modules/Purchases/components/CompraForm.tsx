import { useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useProveedores } from '@/modules/Suppliers/hooks/useProveedores';
import { useProductos } from '@/modules/Products/hooks/useProductos';
import type { CreateCompraDto } from '../interfaces';

const compraSchema = z.object({
  proveedorId: z.string().min(1, 'El proveedor es requerido'),
  fechaCompra: z.string().min(1, 'La fecha es requerida'),
  detalles: z
    .array(
      z.object({
        productoId: z.string().min(1, 'El producto es requerido'),
        cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
        precioUnitario: z.string().min(0, 'El precio debe ser mayor o igual a 0'),
      })
    )
    .min(1, 'Debe agregar al menos un producto'),
});

interface CompraFormProps {
  onSubmit: (data: CreateCompraDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CompraForm({ onSubmit, onCancel, isLoading }: CompraFormProps) {
  const { data: proveedoresData } = useProveedores(1, 100);
  const { data: productosData } = useProductos();

  const form = useForm<CreateCompraDto>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      proveedorId: '',
      fechaCompra: new Date().toISOString().split('T')[0],
      detalles: [{ productoId: '', cantidad: 1, precioUnitario: '0' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'detalles',
  });

  const detalles = useWatch({
    control: form.control,
    name: 'detalles',
  });

  const total = useMemo(() => {
    return detalles?.reduce((sum, detalle) => {
      return sum + (detalle.cantidad || 0) * (Number(detalle.precioUnitario) || 0);
    }, 0) || 0;
  }, [detalles]);

  const handleSubmit = (data: CreateCompraDto) => {
    const formattedData = {
      ...data,
      fechaCompra: new Date(data.fechaCompra).toISOString(),
      detalles: data.detalles.map((d) => ({
        ...d,
        cantidad: Number(d.cantidad),
        precioUnitario: d.precioUnitario,
      })),
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="proveedorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {proveedoresData?.proveedores.map((proveedor: any) => (
                      <SelectItem key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaCompra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Compra *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Detalles de la Compra</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ productoId: '', cantidad: 1, precioUnitario: '0' })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-5">
                <FormField
                  control={form.control}
                  name={`detalles.${index}.productoId`}
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Producto</FormLabel>}
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productosData?.productos.map((producto: any) => (
                            <SelectItem key={producto.id} value={producto.id}>
                              {producto.codigo} - {producto.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`detalles.${index}.cantidad`}
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Cantidad</FormLabel>}
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          value={value || ''}
                          onChange={(e) => {
                            const numValue = e.target.valueAsNumber;
                            onChange(isNaN(numValue) ? 0 : numValue);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`detalles.${index}.precioUnitario`}
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Precio Unit.</FormLabel>}
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={value}
                          onChange={(e) => {
                            onChange(e.target.value);  
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                {index === 0 && <FormLabel className='mb-2'>Subtotal</FormLabel>}
                <Input
                  type="text"
                  readOnly
                  value={`S/ ${(
                    (detalles[index]?.cantidad || 0) *
                    (+detalles[index]?.precioUnitario || 0)
                  ).toFixed(2)}`}
                  className="text-right font-semibold w-full"
                />
              </div>

              <div className="col-span-1 flex items-end">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-2xl font-bold">
            Total: S/ {total.toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Registrar Compra'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
