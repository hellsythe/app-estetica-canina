import { Client } from '@/lib/api/services/client/client';
import { clientService } from '@/lib/api/services/client/client.service';
import { useState, useEffect } from 'react';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data.data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: any) => {
    try {
      const newClient = await clientService.create(clientData);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: any) => {
    try {
      const updatedClient = await clientService.update(id, clientData);
      setClients(prev =>
        prev.map(emp => emp.id === id ? updatedClient : emp)
      );
      return updatedClient;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientService.delete(id);
      setClients(prev => prev.filter(emp => emp.id !== id));
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};