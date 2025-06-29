'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Save,
  Calendar,
  Clock,
  User,
  Scissors,
  Search,
  Plus
} from 'lucide-react';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: any;
  onSave: (appointment: any) => void;
}

export default function AppointmentForm({ isOpen, onClose, appointment, onSave }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    clientName: appointment?.client || '',
    clientPhone: appointment?.clientPhone || '',
    clientEmail: appointment?.clientEmail || '',
    petName: appointment?.pet || '',
    petBreed: appointment?.breed || '',
    service: appointment?.service || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '10:00',
    duration: appointment?.duration || 90,
    price: appointment?.price || '',
    status: appointment?.status || 'Pendiente',
    notes: appointment?.notes || '',
    employee: appointment?.employee || ''
  });

  const [errors, setErrors] = useState<any>({});
  const [isNewClient, setIsNewClient] = useState(false);

  // Mock data - in real app, this would come from your database
  const clients = [
    { id: 1, name: 'María González', phone: '+1 (555) 123-4567', email: 'maria.gonzalez@email.com' },
    { id: 2, name: 'Carlos Ruiz', phone: '+1 (555) 234-5678', email: 'carlos.ruiz@email.com' },
    { id: 3, name: 'Ana Martínez', phone: '+1 (555) 345-6789', email: 'ana.martinez@email.com' }
  ];

  const services = [
    { id: 1, name: 'Baño y Corte Completo', duration: 90, price: 45 },
    { id: 2, name: 'Baño Básico', duration: 45, price: 25 },
    { id: 3, name: 'Corte de Uñas', duration: 20, price: 15 },
    { id: 4, name: 'Spa Canino', duration: 180, price: 85 },
    { id: 5, name: 'Corte Estilizado', duration: 120, price: 55 }
  ];

  const employees = [
    { id: 1, name: 'Ana García', position: 'Groomer Senior' },
    { id: 2, name: 'Carlos Mendez', position: 'Groomer Junior' },
    { id: 3, name: 'Miguel Torres', position: 'Groomer Senior' }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  const handleInputChange = (field: string, value: string) => {
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

  const handleClientSelect = (client: any) => {
    setFormData(prev => ({
      ...prev,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email
    }));
    setIsNewClient(false);
  };

  const handleServiceSelect = (service: any) => {
    setFormData(prev => ({
      ...prev,
      service: service.name,
      duration: service.duration,
      price: service.price.toString()
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    }

    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'El teléfono es requerido';
    }

    if (!formData.petName.trim()) {
      newErrors.petName = 'El nombre de la mascota es requerido';
    }

    if (!formData.service.trim()) {
      newErrors.service = 'Debe seleccionar un servicio';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!formData.time) {
      newErrors.time = 'La hora es requerida';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'El precio es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const appointmentData = {
        ...formData,
        id: appointment?.id || Date.now(),
        client: formData.clientName,
        pet: formData.petName,
        breed: formData.petBreed,
        price: Number(formData.price),
        duration: Number(formData.duration)
      };
      
      onSave(appointmentData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {appointment ? 'Editar Cita' : 'Agendar Nueva Cita'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewClient(!isNewClient)}
                >
                  {isNewClient ? 'Seleccionar Existente' : 'Cliente Nuevo'}
                </Button>
              </div>

              {!isNewClient ? (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Seleccionar Cliente</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {clients.map(client => (
                      <Card
                        key={client.id}
                        className={`cursor-pointer transition-colors ${
                          formData.clientName === client.name ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleClientSelect(client)}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.phone}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Nombre del cliente"
                      className={errors.clientName ? 'border-red-500' : ''}
                    />
                    {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono *</label>
                    <Input
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={errors.clientPhone ? 'border-red-500' : ''}
                    />
                    {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pet Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Mascota</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de la Mascota *</label>
                  <Input
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                    placeholder="Ej: Max"
                    className={errors.petName ? 'border-red-500' : ''}
                  />
                  {errors.petName && <p className="text-red-500 text-xs mt-1">{errors.petName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Raza</label>
                  <Input
                    value={formData.petBreed}
                    onChange={(e) => handleInputChange('petBreed', e.target.value)}
                    placeholder="Ej: Golden Retriever"
                  />
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Servicio</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map(service => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-colors ${
                      formData.service === service.name ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.duration} min</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${service.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Fecha y Hora</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha *</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={errors.date ? 'border-red-500' : ''}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hora *</label>
                  <select
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar hora</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duración (min)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="90"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Precio ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="45.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Empleado Asignado</label>
                  <select
                    value={formData.employee}
                    onChange={(e) => handleInputChange('employee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Asignar automáticamente</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.name}>
                        {employee.name} - {employee.position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notas Especiales</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Instrucciones especiales, alergias, comportamiento de la mascota, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {appointment ? 'Actualizar' : 'Agendar'} Cita
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}