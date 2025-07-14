import { useState, useEffect } from 'react';
import { Cage, PensionStay } from '@/lib/api/services/pension/pension';
import { pensionService } from '@/lib/api/services/pension/pension.service';
import { useOfflineSync } from './useOfflineSync';

export const usePension = () => {
  const [cages, setCages] = useState<Cage[]>([]);
  const [pensionStays, setPensionStays] = useState<PensionStay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for development
  const mockCages: Cage[] = [
    { id: '1', size: 'small', number: 1, status: 'available', location: 'Sección A', notes: '' },
    { id: '2', size: 'small', number: 2, status: 'occupied', location: 'Sección A', notes: '' },
    { id: '3', size: 'small', number: 3, status: 'available', location: 'Sección A', notes: '' },
    { id: '4', size: 'small', number: 4, status: 'maintenance', location: 'Sección A', notes: 'Reparación de puerta' },
    { id: '5', size: 'medium', number: 5, status: 'available', location: 'Sección B', notes: '' },
    { id: '6', size: 'medium', number: 6, status: 'occupied', location: 'Sección B', notes: '' },
    { id: '7', size: 'medium', number: 7, status: 'occupied', location: 'Sección B', notes: '' },
    { id: '8', size: 'medium', number: 8, status: 'available', location: 'Sección B', notes: '' },
    { id: '9', size: 'large', number: 9, status: 'occupied', location: 'Sección C', notes: '' },
    { id: '10', size: 'large', number: 10, status: 'available', location: 'Sección C', notes: '' },
    { id: '11', size: 'large', number: 11, status: 'available', location: 'Sección C', notes: '' },
    { id: '12', size: 'large', number: 12, status: 'maintenance', location: 'Sección C', notes: 'Limpieza profunda' },
  ];

  const mockStays: PensionStay[] = [
    {
      id: '1',
      cageId: '2',
      cage: mockCages.find(c => c.id === '2') as Cage,
      clientId: '1',
      client: { id: '1', name: 'María González', phoneNumber: '+1 (555) 123-4567', email: 'maria@example.com' },
      petId: '1',
      pet: { id: '1', name: 'Max', breed: 'Golden Retriever', age: 3 },
      checkInDate: '2024-01-10',
      checkInTime: '09:30',
      expectedCheckOutDate: '2024-01-15',
      actualCheckOutDate: '',
      checkOutTime: '',
      status: 'active',
      baseRate: 250,
      extraCharges: 0,
      totalCharged: 250,
      isPaid: false,
      pendingServices: [{ id: '1', name: 'Baño y Corte Completo', price: 45 }],
      notes: 'Alimentación especial 2 veces al día',
      createdAt: '2024-01-10T09:30:00',
      updatedAt: '2024-01-10T09:30:00'
    },
    {
      id: '2',
      cageId: '6',
      cage: mockCages.find(c => c.id === '6') as Cage,
      clientId: '2',
      client: { id: '2', name: 'Carlos Ruiz', phoneNumber: '+1 (555) 234-5678', email: 'carlos@example.com' },
      petId: '2',
      pet: { id: '2', name: 'Luna', breed: 'Poodle', age: 2 },
      checkInDate: '2024-01-11',
      checkInTime: '14:00',
      expectedCheckOutDate: '2024-01-14',
      actualCheckOutDate: '',
      checkOutTime: '',
      status: 'active',
      baseRate: 200,
      extraCharges: 50,
      totalCharged: 250,
      isPaid: true,
      pendingServices: [],
      notes: 'Medicación a las 18:00',
      createdAt: '2024-01-11T14:00:00',
      updatedAt: '2024-01-11T14:00:00'
    },
    {
      id: '3',
      cageId: '7',
      cage: mockCages.find(c => c.id === '7') as Cage,
      clientId: '3',
      client: { id: '3', name: 'Ana Martínez', phoneNumber: '+1 (555) 345-6789', email: 'ana@example.com' },
      petId: '3',
      pet: { id: '3', name: 'Rocky', breed: 'Pastor Alemán', age: 4 },
      checkInDate: '2024-01-09',
      checkInTime: '10:15',
      expectedCheckOutDate: '2024-01-16',
      actualCheckOutDate: '',
      checkOutTime: '',
      status: 'active',
      baseRate: 200,
      extraCharges: 0,
      totalCharged: 200,
      isPaid: false,
      pendingServices: [{ id: '2', name: 'Baño Medicinal', price: 35 }],
      notes: '',
      createdAt: '2024-01-09T10:15:00',
      updatedAt: '2024-01-09T10:15:00'
    },
    {
      id: '4',
      cageId: '9',
      cage: mockCages.find(c => c.id === '9') as Cage,
      clientId: '4',
      client: { id: '4', name: 'Luis Fernández', phoneNumber: '+1 (555) 456-7890', email: 'luis@example.com' },
      petId: '4',
      pet: { id: '4', name: 'Thor', breed: 'Rottweiler', age: 5 },
      checkInDate: '2024-01-08',
      checkInTime: '16:45',
      expectedCheckOutDate: '2024-01-18',
      actualCheckOutDate: '',
      checkOutTime: '',
      status: 'active',
      baseRate: 300,
      extraCharges: 100,
      totalCharged: 400,
      isPaid: true,
      pendingServices: [],
      notes: 'Paseo diario obligatorio',
      createdAt: '2024-01-08T16:45:00',
      updatedAt: '2024-01-08T16:45:00'
    }
  ];

  // Offline sync setup
  const { isOnline, pendingSync, addToSyncQueue, syncStatus } = useOfflineSync();

  const fetchCages = async () => {
    setIsLoading(true);
    try {
      // For development, use mock data
      setCages(mockCages);
      
      // For production with real API:
      // const data = await pensionService.getAllCages();
      // setCages(data.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar jaulas');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPensionStays = async () => {
    setIsLoading(true);
    try {
      // For development, use mock data
      setPensionStays(mockStays);
      
      // For production with real API:
      // const data = await pensionService.getAllPensionStays();
      // setPensionStays(data.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estancias');
    } finally {
      setIsLoading(false);
    }
  };

  const createCage = async (cageData: Partial<Cage>) => {
    try {
      // For development
      const newCage: Cage = {
        ...new Cage(),
        ...cageData,
        id: Date.now().toString()
      };
      setCages(prev => [...prev, newCage]);
      
      // For production with real API:
      // const newCage = await pensionService.createCage(cageData);
      // setCages(prev => [...prev, newCage]);
      
      return newCage;
    } catch (err: any) {
      setError(err.message || 'Error al crear jaula');
      throw err;
    }
  };

  const updateCage = async (id: string, cageData: Partial<Cage>) => {
    try {
      // For development
      const updatedCage = { ...cages.find(c => c.id === id), ...cageData };
      setCages(prev => prev.map(c => c.id === id ? updatedCage : c));
      
      // For production with real API:
      // const updatedCage = await pensionService.updateCage(id, cageData);
      // setCages(prev => prev.map(c => c.id === id ? updatedCage : c));
      
      return updatedCage;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar jaula');
      throw err;
    }
  };

  const deleteCage = async (id: string) => {
    try {
      // For development
      setCages(prev => prev.filter(c => c.id !== id));
      
      // For production with real API:
      // await pensionService.deleteCage(id);
      // setCages(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar jaula');
      throw err;
    }
  };

  const createPensionStay = async (stayData: Partial<PensionStay>) => {
    try {
      // For development
      const newStay: PensionStay = {
        ...new PensionStay(),
        ...stayData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update cage status
      if (newStay.cageId) {
        await updateCage(newStay.cageId, { status: 'occupied' });
      }
      
      setPensionStays(prev => [...prev, newStay]);
      
      // For production with real API:
      // const newStay = await pensionService.createPensionStay(stayData);
      // setPensionStays(prev => [...prev, newStay]);
      
      return newStay;
    } catch (err: any) {
      setError(err.message || 'Error al crear estancia');
      throw err;
    }
  };

  const updatePensionStay = async (id: string, stayData: Partial<PensionStay>) => {
    try {
      // For development
      const currentStay = pensionStays.find(s => s.id === id);
      const updatedStay = { ...currentStay, ...stayData, updatedAt: new Date().toISOString() };
      
      // If cage changed, update both cages
      if (stayData.cageId && currentStay?.cageId !== stayData.cageId) {
        // Free old cage
        await updateCage(currentStay?.cageId || '', { status: 'available' });
        // Occupy new cage
        await updateCage(stayData.cageId, { status: 'occupied' });
      }
      
      setPensionStays(prev => prev.map(s => s.id === id ? updatedStay : s));
      
      // For production with real API:
      // const updatedStay = await pensionService.updatePensionStay(id, stayData);
      // setPensionStays(prev => prev.map(s => s.id === id ? updatedStay : s));
      
      return updatedStay;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estancia');
      throw err;
    }
  };

  const checkOutPensionStay = async (id: string, checkoutData: {
    checkOutDate: string,
    checkOutTime: string,
    extraCharges?: number,
    totalCharged: number,
    isPaid: boolean
  }) => {
    try {
      // For development
      const currentStay = pensionStays.find(s => s.id === id);
      const updatedStay = { 
        ...currentStay, 
        ...checkoutData,
        status: 'completed' as const,
        updatedAt: new Date().toISOString()
      };
      
      // Free the cage
      if (currentStay?.cageId) {
        await updateCage(currentStay.cageId, { status: 'available' });
      }
      
      setPensionStays(prev => prev.map(s => s.id === id ? updatedStay : s));
      
      // For production with real API:
      // const updatedStay = await pensionService.checkOutPensionStay(id, checkoutData);
      // setPensionStays(prev => prev.map(s => s.id === id ? updatedStay : s));
      
      return updatedStay;
    } catch (err: any) {
      setError(err.message || 'Error al realizar checkout');
      throw err;
    }
  };

  const deletePensionStay = async (id: string) => {
    try {
      // For development
      const stayToDelete = pensionStays.find(s => s.id === id);
      
      // Free the cage if stay is active
      if (stayToDelete?.status === 'active' && stayToDelete.cageId) {
        await updateCage(stayToDelete.cageId, { status: 'available' });
      }
      
      setPensionStays(prev => prev.filter(s => s.id !== id));
      
      // For production with real API:
      // await pensionService.deletePensionStay(id);
      // setPensionStays(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar estancia');
      throw err;
    }
  };

  // Calculate if a stay needs extra charges
  const calculateExtraCharges = (stay: PensionStay): number => {
    if (stay.status !== 'active') return stay.extraCharges;
    
    const checkInDate = new Date(stay.checkInDate);
    const expectedCheckOut = new Date(stay.expectedCheckOutDate);
    const today = new Date();
    
    // If today is after expected checkout, calculate extra days
    if (today > expectedCheckOut) {
      const extraDays = Math.ceil((today.getTime() - expectedCheckOut.getTime()) / (1000 * 60 * 60 * 24));
      // Assume 50% extra charge per day
      const dailyRate = stay.baseRate / 
        (Math.ceil((expectedCheckOut.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 1);
      
      return extraDays * dailyRate * 1.5; // 50% extra charge
    }
    
    return stay.extraCharges;
  };

  // Get stay duration in days
  const getStayDuration = (stay: PensionStay): number => {
    const checkInDate = new Date(stay.checkInDate);
    const endDate = stay.status === 'completed' && stay.actualCheckOutDate 
      ? new Date(stay.actualCheckOutDate)
      : stay.status === 'active' 
        ? new Date() 
        : new Date(stay.expectedCheckOutDate);
    
    return Math.ceil((endDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  };

  // Check if a stay is overdue
  const isStayOverdue = (stay: PensionStay): boolean => {
    if (stay.status !== 'active') return false;
    
    const expectedCheckOut = new Date(stay.expectedCheckOutDate);
    const today = new Date();
    
    return today > expectedCheckOut;
  };

  useEffect(() => {
    fetchCages();
    fetchPensionStays();
  }, []);

  return {
    cages,
    pensionStays,
    isLoading,
    error,
    syncStatus: { isOnline, pendingSync },
    createCage,
    updateCage,
    deleteCage,
    createPensionStay,
    updatePensionStay,
    checkOutPensionStay,
    deletePensionStay,
    calculateExtraCharges,
    getStayDuration,
    isStayOverdue,
    refetchCages: fetchCages,
    refetchPensionStays: fetchPensionStays
  };
};