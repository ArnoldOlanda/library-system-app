import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
        precioUnitario: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
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
      detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'detalles',
  });

  const [total, setTotal] = useState(0);

  const detalles = form.watch('detalles');

  useEffect(() => {
    const newTotal = detalles.reduce((sum, detalle) => {
      return sum + (detalle.cantidad || 0) * (detalle.precioUnitario || 0);
    }, 0);
    setTotal(newTotal);
  }, [detalles]);

  const handleSubmit = (data: CreateCompraDto) => {
    const formattedData = {
      ...data,
      fechaCompra: new Date(data.fechaCompra).toISOString(),
      detalles: data.detalles.map((d) => ({
        ...d,
        cantidad: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
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
                    <SelectTrigger>
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
                append({ productoId: '', cantidad: 1, precioUnitario: 0 })
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
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productosData?.map((producto: any) => (
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
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Cantidad</FormLabel>}
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                  render={({ field }) => (
                    <FormItem>
                      {index === 0 && <FormLabel>Precio Unit.</FormLabel>}
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                {index === 0 && <FormLabel>Subtotal</FormLabel>}
                <div className="h-10 flex items-center justify-end font-semibold">
                  S/{' '}
                  {(
                    (detalles[index]?.cantidad || 0) *
                    (detalles[index]?.precioUnitario || 0)
                  ).toFixed(2)}
                </div>
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
