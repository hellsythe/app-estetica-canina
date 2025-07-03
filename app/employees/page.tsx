'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmployeeForm from '@/components/forms/EmployeeForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Clock
} from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/lib/api/services/employee/employee';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(new Employee());
    const {
    employees,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees();


  const filteredEmployees = employees.filter((employee: Employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    setSelectedEmployee(new Employee());
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = (employeeData: any) => {
    if (selectedEmployee.id) {
      updateEmployee(employeeData.id, employeeData);
    } else {
      createEmployee(employeeData);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      deleteEmployee(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
            <p className="text-gray-600">Gestiona tu equipo de trabajo</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddEmployee}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Empleado
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar empleados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Todos</Button>
            <Button variant="outline">Activos</Button>
            <Button variant="outline">Inactivos</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-gray-500">+1 este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.filter(e => e.status === 'Activo').length}</div>
              <p className="text-xs text-gray-500">75% del equipo</p>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {/* {employee.avatar} */}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">Empleado</p>
                      <div className="flex items-center space-x-4 mt-1">

                        <div className="flex items-center text-xs text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {employee.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Desde {employee.startDate}
                      </div>
                    </div>
                    <Badge variant={employee.status === 'Activo' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Form Modal */}
        <EmployeeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
        />
      </div>
    </DashboardLayout>
  );
}