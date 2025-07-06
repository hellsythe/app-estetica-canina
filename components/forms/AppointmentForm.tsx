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
  Plus,
  Phone,
  Mail,
  MapPin,
  Heart,
  Filter,
  Users,
  Edit,
  Trash2
} from 'lucide-react';
import { useClients } from '@/hooks/useClient';
import { useServices } from '@/hooks/useService';
import { useEmployees } from '@/hooks/useEmployees';
import toast from 'react-hot-toast';
import { Appointment } from '@/lib/api/services/appointment/appointment';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: any;
  onSave: (appointment: any) => void;
}

interface Pet {
  id?: number;
  name: string;
  breed: string;
  age: string;
  weight?: string;
  color?: string;
  notes?: string;
}

export default function AppointmentForm({ isOpen, onClose, appointment, onSave }: AppointmentFormProps) {
  const [formData, setFormData] = useState<Appointment>(appointment);

  const [errors, setErrors] = useState<any>({});
  const [isNewClient, setIsNewClient] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPetData, setNewPetData] = useState<Pet>({
    name: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    notes: ''
  });
  const [petErrors, setPetErrors] = useState<any>({});

  const { clients, createClient } = useClients();
  const { services } = useServices();
  const { employees } = useEmployees();

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  // Filtrar clientes basado en el término de búsqueda
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.phoneNumber.includes(clientSearchTerm) ||
    client.email?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.pets.some(pet => pet.name.toLowerCase().includes(clientSearchTerm.toLowerCase()))
  );

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

  const handleClientSearch = (value: string) => {
    setClientSearchTerm(value);
    setShowClientDropdown(value.length > 0);

    // Si está buscando, limpiar la selección actual
    if (selectedClient && !value.includes(selectedClient.name)) {
      setSelectedClient(null);
      setSelectedPet(null);
      setFormData(prev => ({
        ...prev,
        clientName: value,
        clientPhone: '',
        clientEmail: '',
        petName: '',
        petBreed: ''
      }));
    }
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setClientSearchTerm(client.name);
    setShowClientDropdown(false);
    setIsNewClient(false);
    setSelectedPet(null); // Reset pet selection

    setFormData(prev => ({
      ...prev,
      clientName: client.name,
      clientPhone: client.phoneNumber,
      clientEmail: client.email,
      petName: '',
      petBreed: ''
    }));
  };

  const handlePetSelect = (pet: any) => {
    setSelectedPet(pet);
    setFormData(prev => ({
      ...prev,
      petName: pet.name,
      petBreed: pet.breed
    }));
  };

  const handleNewPetChange = (field: string, value: string) => {
    setNewPetData(prev => ({
      ...prev,
      [field]: value
    }));

    if (petErrors[field]) {
      setPetErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateNewPet = () => {
    const newErrors: any = {};

    if (!newPetData.name.trim()) {
      newErrors.name = 'El nombre de la mascota es requerido';
    }

    if (!newPetData.breed.trim()) {
      newErrors.breed = 'La raza es requerida';
    }

    setPetErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNewPet = async () => {
    if (!validateNewPet()) return;

    try {
      // Crear una nueva mascota para el cliente seleccionado
      const updatedPets = [...selectedClient.pets, { ...newPetData, id: Date.now() }];

      // Actualizar el cliente con la nueva mascota
      const updatedClientData = {
        ...selectedClient,
        pets: updatedPets
      };

      // Aquí deberías actualizar el cliente en el backend
      // await updateClient(selectedClient.id, updatedClientData);

      // Actualizar el estado local
      setSelectedClient(updatedClientData);

      // Seleccionar automáticamente la nueva mascota
      handlePetSelect(newPetData);

      // Limpiar el formulario de nueva mascota
      setNewPetData({
        name: '',
        breed: '',
        age: '',
        weight: '',
        color: '',
        notes: ''
      });
      setShowAddPetForm(false);
      setPetErrors({});

      toast.success('Mascota agregada exitosamente');
    } catch (error) {
      toast.error('Error al agregar la mascota');
    }
  };

  const handleServiceSelect = (service: any) => {
    setFormData(prev => ({
      ...prev,
      service: service.name,
      duration: service.duration,
      price: service.price.toString()
    }));
  };

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Activo':
        return 'bg-green-100 text-green-800';
      case 'Inactivo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const appointmentData = {
        ...formData,
        client: formData.clientName,
        pet: formData.petName,
        breed: formData.petBreed,
        price: Number(formData.price),
        duration: Number(formData.duration),
        clientInfo: selectedClient,
        petInfo: selectedPet
      };

      await onSave(appointmentData);
      onClose();
    } catch (error: any) {
      if (error?.errors) {
        setErrors(error.errors);
      }
      toast.error('Error al guardar cita');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {appointment.id ? 'Editar Cita' : 'Agendar Nueva Cita'}
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
                  onClick={() => {
                    setIsNewClient(!isNewClient);
                    setSelectedClient(null);
                    setSelectedPet(null);
                    setClientSearchTerm('');
                    setShowClientDropdown(false);
                  }}
                >
                  {isNewClient ? (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Seleccionar Existente
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Cliente Nuevo
                    </>
                  )}
                </Button>
              </div>

              {!isNewClient ? (
                <div className="space-y-4">
                  {/* Client Search */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">Buscar Cliente</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        value={clientSearchTerm}
                        onChange={(e) => handleClientSearch(e.target.value)}
                        onFocus={() => setShowClientDropdown(clientSearchTerm.length > 0)}
                        placeholder="Buscar por nombre, teléfono, email o mascota..."
                        className="pl-10"
                      />
                    </div>

                    {/* Client Dropdown */}
                    {showClientDropdown && filteredClients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                        {filteredClients.map(client => (
                          <div
                            key={client.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleClientSelect(client)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900">{client.name}</h4>
                                  <Badge className={getClientStatusColor(client.status)}>
                                    {client.status}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {client.phoneNumber}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {client.email}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {client.pets.map(pet => pet.name).join(', ')}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                <div>{client.totalVisits} visitas</div>
                                <div>Última: {client.lastVisit}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Client Info */}
                  {selectedClient && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-blue-900">{selectedClient.name}</h4>
                              <Badge className={getClientStatusColor(selectedClient.status)}>
                                {selectedClient.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center text-blue-800">
                                  <Phone className="h-3 w-3 mr-2" />
                                  {selectedClient.phoneNumber}
                                </div>
                                <div className="flex items-center text-blue-800">
                                  <Mail className="h-3 w-3 mr-2" />
                                  {selectedClient.email}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-blue-800">
                                  <span className="font-medium">Visitas:</span> {selectedClient.totalVisits}
                                </div>
                                <div className="text-blue-800">
                                  <span className="font-medium">Última visita:</span> {selectedClient.lastVisit}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
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

            {/* Pet Selection */}
            {selectedClient && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Seleccionar Mascota</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddPetForm(!showAddPetForm)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Mascota
                  </Button>
                </div>

                {/* Add New Pet Form */}
                {showAddPetForm && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-green-800">Nueva Mascota para {selectedClient.name}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowAddPetForm(false);
                            setNewPetData({
                              name: '',
                              breed: '',
                              age: '',
                              weight: '',
                              color: '',
                              notes: ''
                            });
                            setPetErrors({});
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Input
                            placeholder="Nombre de la mascota *"
                            value={newPetData.name}
                            onChange={(e) => handleNewPetChange('name', e.target.value)}
                            className={petErrors.name ? 'border-red-500' : ''}
                          />
                          {petErrors.name && <p className="text-red-500 text-xs mt-1">{petErrors.name}</p>}
                        </div>

                        <div>
                          <Input
                            placeholder="Raza *"
                            value={newPetData.breed}
                            onChange={(e) => handleNewPetChange('breed', e.target.value)}
                            className={petErrors.breed ? 'border-red-500' : ''}
                          />
                          {petErrors.breed && <p className="text-red-500 text-xs mt-1">{petErrors.breed}</p>}
                        </div>

                        <div>
                          <Input
                            placeholder="Edad (ej: 3 años)"
                            value={newPetData.age}
                            onChange={(e) => handleNewPetChange('age', e.target.value)}
                          />
                        </div>

                        <div>
                          <Input
                            placeholder="Peso (ej: 15 kg)"
                            value={newPetData.weight}
                            onChange={(e) => handleNewPetChange('weight', e.target.value)}
                          />
                        </div>

                        <div>
                          <Input
                            placeholder="Color"
                            value={newPetData.color}
                            onChange={(e) => handleNewPetChange('color', e.target.value)}
                          />
                        </div>

                        <div>
                          <Input
                            placeholder="Notas especiales"
                            value={newPetData.notes}
                            onChange={(e) => handleNewPetChange('notes', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddPetForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={handleAddNewPet}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar Mascota
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pet Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedClient.pets.map((pet: any, index: number) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-colors ${
                        selectedPet?.name === pet.name ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handlePetSelect(pet)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Heart className="h-5 w-5 text-red-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-gray-900 truncate">{pet.name}</h4>
                              <p className="text-sm text-gray-600 truncate">{pet.breed}</p>
                              {pet.age && <p className="text-xs text-gray-500">{pet.age}</p>}
                            </div>
                          </div>
                          {selectedPet?.name === pet.name && (
                            <div className="flex-shrink-0 ml-2">
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedClient.pets.length === 0 && !showAddPetForm && (
                  <div className="text-center py-6 text-gray-500">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>Este cliente no tiene mascotas registradas</p>
                    <p className="text-sm">Haz clic en "Agregar Mascota" para registrar una</p>
                  </div>
                )}
              </div>
            )}

            {/* Manual Pet Information for New Clients */}
            {(isNewClient) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información de la Mascota</h3>

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
            )}

            {/* Service Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Servicio</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                        {employee.name}
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
                {appointment.id ? 'Actualizar' : 'Agendar'} Cita
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}