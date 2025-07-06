
import { Appointment } from '@/lib/api/services/appointment/appointment';
import { serviceAppointment } from '@/lib/api/services/appointment/appointment.service';
import { useState, useEffect } from 'react';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await serviceAppointment.getAll();
      setAppointments(data.data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (employeeData: any) => {
    try {
      const newAppointment = await serviceAppointment.create(employeeData);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updateAppointment = async (id: string, employeeData: any) => {
    try {
      const updatedAppointment = await serviceAppointment.update(id, employeeData);
      setAppointments(prev =>
        prev.map(emp => emp.id === id ? updatedAppointment : emp)
      );
      return updatedAppointment;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await serviceAppointment.delete(id);
      setAppointments(prev => prev.filter(emp => emp.id !== id));
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments
  };
};