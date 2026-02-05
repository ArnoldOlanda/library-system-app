import { useState } from 'react';
import { toast } from 'sonner';
import type { CreateCajaDto, UpdateCajaDto } from '../interfaces';
import { useCaja } from '../hooks/useCaja';
import { useCajaHistory } from '../hooks/useCajaHistory';
import { cajaService } from '../services/caja.service';
import { CajaStatus } from '../components/CajaStatus';
import { OpenCajaForm } from '../components/OpenCajaForm';
import { CloseCajaForm } from '../components/CloseCajaForm';
import { CajaHistoryTable } from '../components/CajaHistoryTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RefreshCcw } from 'lucide-react';
import { Can } from '@/components/Can';



export function ArqueosCaja() {
  const { openCaja, loading: cajaLoading, refetch: refetchCaja } = useCaja();
  const { arqueos, loading: historyLoading, refetch: refetchHistory } = useCajaHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);

  const handleOpenCaja = async (data: CreateCajaDto) => {
    setIsSubmitting(true);
    try {
      await cajaService.create(data);
      toast.success('Caja abierta exitosamente',{
        position: 'top-center',
      });
      setIsOpenDialogOpen(false);
      await refetchCaja();
      await refetchHistory();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al abrir caja';
      toast.error(errorMessage,{
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCaja = async (id: string, data: UpdateCajaDto) => {
    setIsSubmitting(true);
    try {
      await cajaService.update(id, data);
      toast.success('Caja cerrada exitosamente',{
        position: 'top-center',
      });
      setIsDialogOpen(false);
      await refetchCaja();
      await refetchHistory();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al cerrar caja';
      toast.error(errorMessage,{
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestión de Caja</h1>
        <p className="text-muted-foreground">
          Administra la apertura, cierre y consulta de la caja del día
        </p>
      </div>

      {/* Current Cash Register Status */}
      <CajaStatus caja={openCaja} loading={cajaLoading} />

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Historial de Cajas</h2>
          
          <div className='flex gap-2 items-center'>
            {/* Open Cash Register Button */}
            {!openCaja && !cajaLoading && (
              <Can I='create' a='arqueo'>
                <Dialog open={isOpenDialogOpen} onOpenChange={setIsOpenDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      Abrir Caja del Día
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg w-[90%] md:w-[50%] lg:w-[30%]">
                    <DialogHeader>
                      <DialogTitle>Abrir Caja</DialogTitle>
                      <DialogDescription>
                        Ingresa el monto inicial con el que comenzarás las operaciones del día.
                      </DialogDescription>
                    </DialogHeader>
                    <OpenCajaForm onSubmit={handleOpenCaja} isSubmitting={isSubmitting} />
                  </DialogContent>
                </Dialog>
              </Can>
            )}

            {/* Close Cash Register Button */}
            {openCaja && (
              <Can I='update' a='arqueo'>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      Cerrar Caja del Día
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl lg:w-[40%] sm:w-[90%] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cerrar Caja</DialogTitle>
                      <DialogDescription>
                        Ingresa los montos contados en efectivo y tarjeta. Verifica que los totales coincidan antes de confirmar el cierre.
                      </DialogDescription>
                    </DialogHeader>
                    <CloseCajaForm
                      caja={openCaja}
                      onSubmit={handleCloseCaja}
                      isSubmitting={isSubmitting}
                    />
                  </DialogContent>
                </Dialog>
              </Can>
            )}
            <Button
              onClick={() => refetchHistory()}
              className="px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <RefreshCcw />
              Actualizar
            </Button>
          </div>
        </div>
        <CajaHistoryTable arqueos={arqueos} loading={historyLoading} />
      </div>
    </div>
  );
}
