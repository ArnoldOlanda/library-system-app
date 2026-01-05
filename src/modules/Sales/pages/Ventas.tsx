import { useState } from 'react';
import { useVentas } from '../hooks/useVentas';
import { VentasTable } from '../components/VentasTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ventasService } from '../services/ventas.service';
import type { Venta } from '../../Pos/interfaces';
import { Filter, X } from 'lucide-react';
import { ConfirmDialog } from '../../../components/dialogs/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

export function Ventas() {
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState<string>();

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, refetch } = useVentas(page, pageSize, startDate, endDate, debouncedSearch);

  const handleDelete = async (venta: Venta) => {
    setSelectedVenta(venta);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if(!selectedVenta) return;
    try {
      await ventasService.delete(selectedVenta.id);
      toast.success('Venta eliminada correctamente');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar la venta');
    }
  }

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
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Ventas</h1>
      </div>

      <div className="p-4 rounded-lg border bg-card shadow-sm py-4 my-2">
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

      <VentasTable 
        isLoading={isLoading}
        data={data}
        onView={handleView}
        onDelete={handleDelete}
        onEdit={()=>{}}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onPageSizeChange={(size)=>{
          setPageSize(size);
          setPage(1);
        }}
      />

      <ConfirmDialog 
        title="Confirmar anulación de Venta"
        description={<>
          ¿Estás seguro de anular esta venta? Se revertirá el stock de los productos vendidos.
        </>}
        confirmText="Anular Venta"
        cancelText="Cancelar"
        destructive
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
