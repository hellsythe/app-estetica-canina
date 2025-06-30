'use client';

import { useState, useEffect } from 'react';
import { syncManager, dataManager } from '@/lib/storage';

export interface SyncStatus {
  isOnline: boolean;
  pendingSync: number;
  totalSync: number;
  lastSyncAttempt: Date | null;
  syncInProgress: boolean;
}

export const useOfflineSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    pendingSync: 0,
    totalSync: 0,
    lastSyncAttempt: null,
    syncInProgress: false
  });

  useEffect(() => {
    const updateSyncStatus = () => {
      const queueStatus = syncManager.getSyncQueueStatus();
      setSyncStatus(prev => ({
        ...prev,
        isOnline: syncManager.isOnlineStatus(),
        pendingSync: queueStatus.pending,
        totalSync: queueStatus.total
      }));
    };

    // Actualizar estado inicial
    updateSyncStatus();

    // Escuchar cambios de conectividad
    const handleOnline = () => {
      updateSyncStatus();
      setSyncStatus(prev => ({ ...prev, lastSyncAttempt: new Date() }));
    };

    const handleOffline = () => {
      updateSyncStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Actualizar estado cada 5 segundos
    const interval = setInterval(updateSyncStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const forcSync = async () => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));
    try {
      await syncManager.processSyncQueue();
      setSyncStatus(prev => ({ ...prev, lastSyncAttempt: new Date() }));
    } finally {
      setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
    }
  };

  return {
    syncStatus,
    forcSync,
    dataManager
  };
};

// Hook específico para cada tipo de datos
export const useClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const { syncStatus, dataManager: dm } = useOfflineSync();

  useEffect(() => {
    // Cargar datos iniciales
    const loadedClients = dm.clients.getAll();
    setClients(loadedClients);
  }, []);

  const addClient = (client: any) => {
    const newClient = dm.clients.add(client);
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string | number, updates: any) => {
    dm.clients.update(id, updates);
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteClient = (id: string | number) => {
    dm.clients.delete(id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    syncStatus
  };
};

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const { syncStatus, dataManager: dm } = useOfflineSync();

  useEffect(() => {
    const loadedAppointments = dm.appointments.getAll();
    setAppointments(loadedAppointments);
  }, []);

  const addAppointment = (appointment: any) => {
    const newAppointment = dm.appointments.add(appointment);
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id: string | number, updates: any) => {
    dm.appointments.update(id, updates);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAppointment = (id: string | number) => {
    dm.appointments.delete(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    syncStatus
  };
};

export const useServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const { syncStatus, dataManager: dm } = useOfflineSync();

  useEffect(() => {
    const loadedServices = dm.services.getAll();
    setServices(loadedServices);
  }, []);

  const addService = (service: any) => {
    const newService = dm.services.add(service);
    setServices(prev => [...prev, newService]);
    return newService;
  };

  const updateService = (id: string | number, updates: any) => {
    dm.services.update(id, updates);
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string | number) => {
    dm.services.delete(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return {
    services,
    addService,
    updateService,
    deleteService,
    syncStatus
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const { syncStatus, dataManager: dm } = useOfflineSync();

  useEffect(() => {
    const loadedProducts = dm.products.getAll();
    setProducts(loadedProducts);
  }, []);

  const addProduct = (product: any) => {
    const newProduct = dm.products.add(product);
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string | number, updates: any) => {
    dm.products.update(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string | number) => {
    dm.products.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    syncStatus
  };
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const { syncStatus, dataManager: dm } = useOfflineSync();

  useEffect(() => {
    const loadedEmployees = dm.employees.getAll();
    setEmployees(loadedEmployees);
  }, []);

  const addEmployee = (employee: any) => {
    const newEmployee = dm.employees.add(employee);
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id: string | number, updates: any) => {
    dm.employees.update(id, updates);
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEmployee = (id: string | number) => {
    dm.employees.delete(id);
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    syncStatus
  };
};