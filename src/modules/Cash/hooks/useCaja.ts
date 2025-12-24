import { useState, useEffect } from 'react';
import { cajaService } from '../services/caja.service';
import type { Caja } from '../interfaces';

export const useCaja = () => {
  const [openCaja, setOpenCaja] = useState<Caja | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpenCaja = async () => {
    try {
      setLoading(true);
      setError(null);
      const caja = await cajaService.getOpenCaja();
      setOpenCaja(caja);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No hay caja abierta');
      setOpenCaja(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenCaja();
  }, []);

  return {
    openCaja,
    loading,
    error,
    refetch: fetchOpenCaja,
  };
};
