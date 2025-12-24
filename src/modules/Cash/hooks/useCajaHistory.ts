import { useState, useEffect } from 'react';
import { cajaService } from '../services/caja.service';
import type { Caja } from '../interfaces';

export const useCajaHistory = () => {
  const [arqueos, setArqueos] = useState<Caja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cajaService.getAll(0, 20);
      setArqueos(response.arqueos || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar historial');
      setArqueos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    arqueos,
    loading,
    error,
    refetch: fetchHistory,
  };
};
