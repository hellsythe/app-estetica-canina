import { Employee } from '@/lib/api/services/employee/employee';
import { employeeService } from '@/lib/api/services/employee/employee.service';
import { useState, useEffect } from 'react';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmployee = async (employeeData: any) => {
    try {
      const newEmployee = await employeeService.create(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateEmployee = async (id: string, employeeData: any) => {
    try {
      const updatedEmployee = await employeeService.update(id, employeeData);
      setEmployees(prev =>
        prev.map(emp => emp.id === id ? updatedEmployee : emp)
      );
      return updatedEmployee;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeService.delete(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees
  };
};