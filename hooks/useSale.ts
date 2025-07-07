import { Sale } from '@/lib/api/services/sale/sale';
import { saleService } from '@/lib/api/services/sale/sale.service';
import { useState, useEffect } from 'react';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const data = await saleService.getAll();
      setSales(data.data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createSale = async (data: any) => {
    try {
      const newSale = await saleService.create(data);
      setSales(prev => [...prev, newSale]);
      return newSale;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updateSale = async (id: string, data: any) => {
    try {
      const updatedSale = await saleService.update(id, data);
      setSales(prev =>
        prev.map(emp => emp.id === id ? updatedSale : emp)
      );
      return updatedSale;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      await saleService.delete(id);
      setSales(prev => prev.filter(emp => emp.id !== id));
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    isLoading,
    error,
    createSale,
    updateSale,
    deleteSale,
    refetch: fetchSales
  };
};