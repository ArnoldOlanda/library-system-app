import { useState } from 'react';
import { useCaja } from '../hooks/useCaja';
import { useCajaHistory } from '../hooks/useCajaHistory';
import { cajaService } from '../services/caja.service';
import { CajaStatus } from '../components/CajaStatus';
import { OpenCajaForm } from '../components/OpenCajaForm';
import { CloseCajaForm } from '../components/CloseCajaForm';
import { CajaHistoryTable } from '../components/CajaHistoryTable';
import type { CreateCajaDto, UpdateCajaDto } from '../interfaces';

export function ArqueosCaja() {
  const { openCaja, loading: cajaLoading, refetch: refetchCaja } = useCaja();
  const { arqueos, loading: historyLoading, refetch: refetchHistory } = useCajaHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenCaja = async (data: CreateCajaDto) => {
    setIsSubmitting(true);
    try {
      await cajaService.create(data);
      setSuccessMessage('✓ Caja abierta exitosamente');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await refetchCaja();
      await refetchHistory();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al abrir caja';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCaja = async (id: string, data: UpdateCajaDto) => {
    if (!confirm('¿Estás seguro de cerrar la caja? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await cajaService.update(id, data);
      setSuccessMessage('✓ Caja cerrada exitosamente');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await refetchCaja();
      await refetchHistory();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al cerrar caja';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Gestión de Caja</h1>
        <p className="text-muted-foreground">
          Administra la apertura, cierre y consulta de arqueos de caja
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-pulse">
          <p className="text-lg font-bold">{successMessage}</p>
        </div>
      )}

      {/* Current Cash Register Status */}
      <CajaStatus caja={openCaja} loading={cajaLoading} />

      {/* Open/Close Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Cash Register Form */}
        {!openCaja && !cajaLoading && (
          <OpenCajaForm onSubmit={handleOpenCaja} isSubmitting={isSubmitting} />
        )}

        {/* Close Cash Register Form */}
        {openCaja && (
          <CloseCajaForm
            caja={openCaja}
            onSubmit={handleCloseCaja}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Historial de Arqueos</h2>
          <button
            onClick={() => refetchHistory()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
          >
            Actualizar
          </button>
        </div>
        <CajaHistoryTable arqueos={arqueos} loading={historyLoading} />
      </div>

      {/* Summary Stats */}
      {arqueos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Total Arqueos</p>
            <p className="text-2xl font-bold text-blue-900">{arqueos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold">Total Recaudado</p>
            <p className="text-2xl font-bold text-green-900">
              ${arqueos.reduce((sum, a) => sum + Number(a.totalRecaudado), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold">Total Efectivo</p>
            <p className="text-2xl font-bold text-purple-900">
              ${arqueos.reduce((sum, a) => sum + Number(a.totalEfectivo), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-semibold">Total Tarjeta</p>
            <p className="text-2xl font-bold text-orange-900">
              ${arqueos.reduce((sum, a) => sum + Number(a.totalTarjeta), 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
