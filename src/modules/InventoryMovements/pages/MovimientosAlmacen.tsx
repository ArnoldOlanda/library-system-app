import { useState } from 'react';
import { MovimientosTable } from '../components/MovimientosTable';
import { useMovimientosAlmacen } from '../hooks/useMovimientosAlmacen';

export default function MovimientosAlmacen() {
  const [query] = useState({ limit: 50, offset: 0 });

  const { data, isLoading, error } = useMovimientosAlmacen(query);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-sm text-muted-foreground">
            Cargando movimientos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los movimientos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Movimientos de Almacén</h1>
        <p className="text-muted-foreground">
          Historial de entradas y salidas de productos
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <MovimientosTable data={data?.movimientos || []} />
      </div>
    </div>
  );
}
