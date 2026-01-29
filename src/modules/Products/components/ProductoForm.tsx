import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Producto } from '../interfaces';
import type { Categoria } from '@/modules/Categories/interfaces';
import { useProductStore } from '../store/productStore';
import { useEffect } from 'react';

const productoSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .max(50, 'El código no puede exceder 50 caracteres'),
  codigoBarras: z
    .string()
    .max(100, 'El código de barras no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  categoriaId: z.string().min(1, 'La categoría es requerida'),
  precioCompra: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'El precio de compra debe ser un número válido mayor o igual a 0',
    }),
  precioVenta: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: 'El precio de venta debe ser un número válido mayor o igual a 0',
    }),
  stock: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0),
      {
        message: 'El stock debe ser un número válido mayor o igual a 0',
      }
    ),
  stockMinimo: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0),
      {
        message: 'El stock mínimo debe ser un número válido mayor o igual a 0',
      }
    ),
  descripcion: z.string().optional(),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  producto?: Producto;
  categorias: Categoria[];
  onSubmit: (data: ProductoFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductoForm({ producto, categorias, onSubmit, onCancel, isLoading }: ProductoFormProps) {

  const barCodeScanned = useProductStore((state) => state.barCodeScanned);

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      codigo: producto?.codigo || '',
      codigoBarras: producto?.codigoBarras || '',
      nombre: producto?.nombre || '',
      categoriaId: producto?.categoria?.id || '',
      precioCompra: producto?.precioCompra?.toString() || '0',
      precioVenta: producto?.precioVenta?.toString() || '0',
      stock: producto?.stock?.toString() || '0',
      stockMinimo: producto?.stockMinimo?.toString() || '0',
      descripcion: producto?.descripcion || '',
    },
  });

  // Efecto para actualizar el campo codigoBarras cuando se escanea un código de barras
  useEffect(() => {
    if (barCodeScanned) {
      form.setValue('codigoBarras', barCodeScanned);
    }
  }, [barCodeScanned, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código (SKU)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: LAP-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Lápiz HB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigoBarras"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Barras (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 7501234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoriaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="precioCompra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de Compra</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precioVenta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de Venta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockMinimo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del producto..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : producto ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
