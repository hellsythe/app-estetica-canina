'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Save,
  Calendar,
  Clock,
  Search,
  Plus,
  Phone,
  Mail,
  Heart,
  Users,
  Home,
  DollarSign,
  Clipboard,
  Check
} from 'lucide-react';
import { useClients } from '@/hooks/useClient';
import { useServices } from '@/hooks/useService';
import { Cage, PensionStay } from '@/lib/api/services/pension/pension';
import { Client, Pet } from '@/lib/api/services/client/client';
import toast from 'react-hot-toast';

interface PensionStayFormProps {
  isOpen: boolean;
  onClose: () => void;
  pensionStay?: PensionStay;
  availableCages: Cage[];
  onSave: (pensionStay: PensionStay) => void;
}

export default function PensionStayForm({ 
  isOpen, 
  onClose, 
  pensionStay = new PensionStay(), 
  availableCages,
  onSave 
}: PensionStayFormProps) {
  const [formData, setFormData] = useState<PensionStay>(pensionStay);
  const [errors, setErrors] = useState<any>({});
  const [isNewClient, setIsNewClient] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPetData, setNewPetData] = useState<Pet>(new Pet());
  const [petErrors, setPetErrors] = useState<any>({});
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  const { clients, createClient } = useClients();
  const { services } = useServices();

  // Reset form when pensionStay changes
  useEffect(() => {
    setFormData(pensionStay);
    
    if (pensionStay.client) {
      setSelectedClient(pensionStay.client);
      setSelectedPet(pensionStay.pet);
    } else {
      setSelectedClient(null);
      setSelectedPet(null);
    }
    
    setSelectedServices(pensionStay.pendingServices || []);
    setErrors({});
  }, [pensionStay]);

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.phoneNumber.includes(clientSearchTerm) ||
    client.email?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.pets?.some(pet => pet.name.toLowerCase().includes(clientSearchTerm.toLowerCase()))
  );

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

  const handleClientSearch = (value: string) => {
    setClientSearchTerm(value);
    setShowClientDropdown(value.length > 0);

    // Clear selection if search term doesn't match selected client
    if (selectedClient && !value.includes(selectedClient.name)) {
      setSelectedClient(null);
      setSelectedPet(null);
      setFormData(prev => ({
        ...prev,
        clientId: '',
        petId: '',
        client: null,
        pet: null
      }));
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientSearchTerm(client.name);
    setShowClientDropdown(false);
    setIsNewClient(false);
    setSelectedPet(null);

    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      client: client,
      petId: '',
      pet: null
    }));

    setErrors(prev => ({
      ...prev,
      client: ''
    }));
  };

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
    setFormData(prev => ({
      ...prev,
      petId: pet.id.toString(),
      pet: pet
    }));

    setErrors(prev => ({
      ...prev,
      pet: ''
    }));
  };

  const handleNewPetChange = (field: string, value: any) => {
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
      // Create a new pet for the selected client
      const updatedPets = [...(selectedClient?.pets || []), { ...newPetData, id: Date.now() }];

      // Update the client with the new pet
      const updatedClientData = {
        ...selectedClient,
        pets: updatedPets
      };

      // Here you would update the client in the backend
      // await updateClient(selectedClient.id, updatedClientData);

      // Update local state
      setSelectedClient(updatedClientData);

      // Automatically select the new pet
      handlePetSelect(newPetData);

      // Clear the new pet form
      setNewPetData(new Pet());
      setShowAddPetForm(false);
      setPetErrors({});

      toast.success('Mascota agregada exitosamente');
    } catch (error) {
      toast.error('Error al agregar la mascota');
    }
  };

  const handleServiceToggle = (service: any) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const calculateTotalRate = () => {
    // Base rate from form
    const baseRate = parseFloat(formData.baseRate.toString()) || 0;
    
    // Extra charges from form
    const extraCharges = parseFloat(formData.extraCharges.toString()) || 0;
    
    // Services total
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
    
    return baseRate + extraCharges + servicesTotal;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!selectedClient) {
      newErrors.client = 'Debe seleccionar un cliente';
    }

    if (!selectedPet) {
      newErrors.pet = 'Debe seleccionar una mascota';
    }

    if (!formData.cageId) {
      newErrors.cageId = 'Debe seleccionar una jaula';
    }

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'La fecha de ingreso es requerida';
    }

    if (!formData.checkInTime) {
      newErrors.checkInTime = 'La hora de ingreso es requerida';
    }

    if (!formData.expectedCheckOutDate) {
      newErrors.expectedCheckOutDate = 'La fecha de salida esperada es requerida';
    } else if (new Date(formData.expectedCheckOutDate) <= new Date(formData.checkInDate)) {
      newErrors.expectedCheckOutDate = 'La fecha de salida debe ser posterior a la fecha de ingreso';
    }

    if (!formData.baseRate) {
      newErrors.baseRate = 'La tarifa base es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const totalCharged = calculateTotalRate();
      
      const stayData: PensionStay = {
        ...formData,
        clientId: selectedClient?.id || '',
        client: selectedClient,
        petId: selectedPet?.id.toString() || '',
        pet: selectedPet,
        pendingServices: selectedServices,
        totalCharged,
        updatedAt: new Date().toISOString()
      };

      await onSave(stayData);
      onClose();
      toast.success(pensionStay.id ? 'Estancia actualizada correctamente' : 'Estancia creada correctamente');
    } catch (error: any) {
      toast.error('Error al guardar la estancia');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {pensionStay.id ? 'Editar Estancia' : 'Registrar Nueva Estancia'}
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
                    setSelectedClient(isNewClient ? null : new Client());
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
                    {errors.client && <p className="text-red-500 text-sm">{errors.client}</p>}

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
                                  <Badge className={client.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
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
                                    {client.pets?.map(pet => pet.name).join(', ') || 'Sin mascotas'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                <div>{client.totalVisits || 0} visitas</div>
                                <div>Última: {client.lastVisit || 'N/A'}</div>
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
                              <Badge className={selectedClient.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
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
                                  <span className="font-medium">Visitas:</span> {selectedClient.totalVisits || 0}
                                </div>
                                <div className="text-blue-800">
                                  <span className="font-medium">Última visita:</span> {selectedClient.lastVisit || 'N/A'}
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
                      value={selectedClient?.name || ''}
                      onChange={(e) => setSelectedClient(prev => ({ ...prev as Client, name: e.target.value }))}
                      placeholder="Nombre del cliente"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono *</label>
                    <Input
                      value={selectedClient?.phoneNumber || ''}
                      onChange={(e) => setSelectedClient(prev => ({ ...prev as Client, phoneNumber: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className={errors.phoneNumber ? 'border-red-500' : ''}
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={selectedClient?.email || ''}
                      onChange={(e) => setSelectedClient(prev => ({ ...prev as Client, email: e.target.value }))}
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
                            setNewPetData(new Pet());
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
                  {selectedClient.pets?.map((pet: Pet, index: number) => (
                    <Card
                      key={pet.id || index}
                      className={`cursor-pointer transition-colors ${
                        selectedPet?.id === pet.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
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
                              {pet.age && <p className="text-xs text-gray-500">{pet.age} años</p>}
                            </div>
                          </div>
                          {selectedPet?.id === pet.id && (
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

                {(!selectedClient.pets || selectedClient.pets.length === 0) && !showAddPetForm && (
                  <div className="text-center py-6 text-gray-500">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>Este cliente no tiene mascotas registradas</p>
                    <p className="text-sm">Haz clic en Agregar Mascota para registrar una</p>
                  </div>
                )}

                {errors.pet && <p className="text-red-500 text-sm">{errors.pet}</p>}
              </div>
            )}

            {/* Cage Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar Jaula</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tamaño de Jaula</label>
                  <select
                    value={formData.cage?.size || ''}
                    onChange={(e) => {
                      // Reset cage selection when size changes
                      setFormData(prev => ({
                        ...prev,
                        cageId: '',
                        cage: { ...prev.cage, size: e.target.value as 'small' | 'medium' | 'large' }
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar tamaño</option>
                    <option value="small">Pequeña</option>
                    <option value="medium">Mediana</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
              </div>

              {/* Available Cages Grid */}
              {formData.cage?.size && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableCages
                    .filter(cage => 
                      cage.size === formData.cage?.size && 
                      (cage.status === 'available' || cage.id === formData.cageId)
                    )
                    .map((cage) => (
                      <Card
                        key={cage.id}
                        className={`cursor-pointer transition-colors ${
                          formData.cageId === cage.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleInputChange('cageId', cage.id)}
                      >
                        <CardContent className="p-3 text-center">
                          <Home className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                          <p className="font-medium">Jaula #{cage.number}</p>
                          <p className="text-xs text-gray-600">{cage.location}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}

              {formData.cage?.size && availableCages.filter(cage => 
                cage.size === formData.cage?.size && 
                (cage.status === 'available' || cage.id === formData.cageId)
              ).length === 0 && (
                <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-lg">
                  <p>No hay jaulas {
                    formData.cage.size === 'small' ? 'pequeñas' : 
                    formData.cage.size === 'medium' ? 'medianas' : 'grandes'
                  } disponibles en este momento</p>
                </div>
              )}

              {errors.cageId && <p className="text-red-500 text-sm">{errors.cageId}</p>}
            </div>

            {/* Check-in Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de Estancia</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Ingreso *</label>
                  <Input
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                    className={errors.checkInDate ? 'border-red-500' : ''}
                  />
                  {errors.checkInDate && <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hora de Ingreso *</label>
                  <Input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    className={errors.checkInTime ? 'border-red-500' : ''}
                  />
                  {errors.checkInTime && <p className="text-red-500 text-xs mt-1">{errors.checkInTime}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Salida Esperada *</label>
                  <Input
                    type="date"
                    value={formData.expectedCheckOutDate}
                    onChange={(e) => handleInputChange('expectedCheckOutDate', e.target.value)}
                    min={formData.checkInDate}
                    className={errors.expectedCheckOutDate ? 'border-red-500' : ''}
                  />
                  {errors.expectedCheckOutDate && <p className="text-red-500 text-xs mt-1">{errors.expectedCheckOutDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Activa</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de Pago</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tarifa Base Diaria *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.baseRate || ''}
                      onChange={(e) => handleInputChange('baseRate', parseFloat(e.target.value))}
                      placeholder="0.00"
                      className={`pl-10 ${errors.baseRate ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.baseRate && <p className="text-red-500 text-xs mt-1">{errors.baseRate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cargos Adicionales</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.extraCharges || ''}
                      onChange={(e) => handleInputChange('extraCharges', parseFloat(e.target.value))}
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pago Anticipado</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPaid}
                      onChange={(e) => handleInputChange('isPaid', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Marcar como pagado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Servicios Pendientes</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {services.map(service => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={selectedServices.some(s => s.id === service.id)}
                      onChange={() => handleServiceToggle(service)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={`service-${service.id}`} className="text-sm text-gray-700 flex-1">
                      {service.name}
                    </label>
                    <span className="text-sm font-medium text-green-600">${service.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Estimado:</span>
                  <span className="text-xl font-bold text-green-600">${calculateTotalRate().toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Incluye tarifa base, cargos adicionales y servicios seleccionados
                </p>
              </CardContent>
            </Card>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notas Especiales</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Instrucciones especiales, alimentación, medicación, etc."
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
                {pensionStay.id ? 'Actualizar' : 'Registrar'} Estancia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}