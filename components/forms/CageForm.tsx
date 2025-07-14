'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  X,
  Save,
  Home
} from 'lucide-react';
import { Cage } from '@/lib/api/services/pension/pension';

interface CageFormProps {
  isOpen: boolean;
  onClose: () => void;
  cage: Cage;
  onSave: (cage: Cage) => void;
}

export default function CageForm({ isOpen, onClose, cage, onSave }: CageFormProps) {
  const [formData, setFormData] = useState<Cage>(cage);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.number) {
      newErrors.number = 'El número de jaula es requerido';
    }

    if (!formData.size) {
      newErrors.size = 'El tamaño de jaula es requerido';
    }

    if (!formData.location) {
      newErrors.location = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {cage.id ? 'Editar Jaula' : 'Agregar Jaula'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Número de Jaula *</label>
              <Input
                type="number"
                value={formData.number || ''}
                onChange={(e) => handleInputChange('number', parseInt(e.target.value))}
                placeholder="1"
                className={errors.number ? 'border-red-500' : ''}
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tamaño *</label>
              <select
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.size ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar tamaño</option>
                <option value="small">Pequeña</option>
                <option value="medium">Mediana</option>
                <option value="large">Grande</option>
              </select>
              {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ubicación *</label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ej: Sección A"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notas</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas adicionales sobre la jaula..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {cage.id ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}