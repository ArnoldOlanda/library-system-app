import { useState } from 'react';
import { useVentas } from '../hooks/useVentas';
import { VentasTable } from '../components/VentasTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ventasService } from '../services/ventas.service';
import type { Venta } from '../../Pos/interfaces';
import { Filter, X } from 'lucide-react';

export function Ventas() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { data, isLoading, refetch } = useVentas(page, limit, startDate, endDate);

  const handleDelete = async (venta: Venta) => {
    if (confirm('¿Estás seguro de eliminar esta venta? Se revertirá el stock de los productos.')) {
      try {
        await ventasService.delete(venta.id);
        toast.success('Venta eliminada correctamente');
        refetch();
      } catch (error) {
        toast.error('Error al eliminar la venta');
      }
    }
  };

  const handleView = (venta: Venta) => {
    // Implementar ver detalle (puedes usar un modal)
    console.log('Ver detalle de venta:', venta);
    toast.info('Detalle de venta (en desarrollo)');
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Ventas</h1>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Desde:</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Hasta:</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setPage(1)} className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
            {(startDate || endDate) && (
              <Button variant="ghost" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Cargando ventas...</p>
        </div>
      ) : (
        <VentasTable 
          data={data?.ventas || []} 
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
