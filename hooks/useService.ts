import { Service } from '@/lib/api/services/service/service';
import { serviceService } from '@/lib/api/services/service/service.service';
import { useState, useEffect } from 'react';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await serviceService.getAll();
      setServices(data.data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createService = async (data: any) => {
    try {
      const newService = await serviceService.create(data);
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updateService = async (id: string, data: any) => {
    try {
      const updatedService = await serviceService.update(id, data);
      setServices(prev =>
        prev.map(emp => emp.id === id ? updatedService : emp)
      );
      return updatedService;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await serviceService.delete(id);
      setServices(prev => prev.filter(emp => emp.id !== id));
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices
  };
};