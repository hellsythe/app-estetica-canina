'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Save,
  User,
} from 'lucide-react';
import { Employee } from '@/lib/api/services/employee/employee';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSave: (employee: any) => void;
}

export default function EmployeeForm({ isOpen, onClose, employee, onSave }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Employee>(employee);
  useEffect(() => {
    setFormData(employee);
  }, [employee]);

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: any) => {
    const processedValue = field === 'salary' ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('anime');
      console.error('anime');
      console.error('anime');
      console.error('anime');
      console.error('anime');
      console.error(error);
      // setErrors(prev => ({
      //   ...prev,
      //   [field]: 'Error al guardar'
      // }));
    }
    // onSave(formData);
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {employee.id ? 'Editar Empleado' : 'Agregar Empleado'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Ana García"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Apellidos *</label>
                  <Input
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                    placeholder="Ej: Ana García"
                    className={errors.lastname ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono *</label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Dirección</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Calle Principal 123, Ciudad"
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Laboral</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Salario Mensual *</label>
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="2500"
                    className={errors.salary ? 'border-red-500' : ''}
                  />
                  {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Inicio</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Licencia">Licencia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contacto de Emergencia</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del Contacto</label>
                  <Input
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Nombre del familiar o contacto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono de Emergencia</label>
                  <Input
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notas Adicionales</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Información adicional sobre el empleado..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {employee.id ? 'Actualizar' : 'Guardar'} Empleado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}