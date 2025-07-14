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
  Heart,
  Plus,
  Trash2
} from 'lucide-react';
import { Client, Pet } from '@/lib/api/services/client/client';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any;
  onSave: (client: any) => void;
}

export default function ClientForm({ isOpen, onClose, client, onSave }: ClientFormProps) {
  const [formData, setFormData] = useState<Client>(client);
  useEffect(() => {
    setFormData(client);
    setErrors({});
  }, [client]);

  const [pets, setPets] = useState<Pet[]>(client?.pets?.map((pet: any, index: number) => ({
    name: pet.name || '',
    breed: pet.breed || '',
    age: pet.age || '',
    weight: '',
    color: '',
    notes: '',
    id: index + 1,
  })) || []);

  useEffect(() => {
    setPets(client.pets);
  }, [client.pets]);

  const [errors, setErrors] = useState<any>({});

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

  const handlePetChange = (petId: number, field: string, value: string) => {
    setPets(prev => prev.map(pet =>
      pet.id === petId ? { ...pet, [field]: value } : pet
    ));
  };

  const addPet = () => {
    const newPet: Pet = {
      id: Date.now(),
      name: '',
      breed: '',
      age: 0,
      weight: 0,
      color: '',
      notes: ''
    };
    setPets(prev => [...prev, newPet]);
  };

  const removePet = (petId: number) => {
    setPets(prev => prev.filter(pet => pet.id !== petId));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      try {
      await onSave({
      ...formData,
        pets: pets.filter(pet => pet.name.trim()),
    });
      onClose();
    } catch (error: any) {
      if (error?.errors) {
        setErrors(error.errors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {client ? 'Editar Cliente' : 'Agregar Cliente'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: María González"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="maria.gonzalez@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono *</label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="274 109 2556"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
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
                  </select>
                </div>
              </div>
            </div>

            {/* Pets Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mascotas</h3>
                <Button type="button" onClick={addPet} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Mascota
                </Button>
              </div>

              {errors.pets && <p className="text-red-500 text-sm">{errors.pets}</p>}

              <div className="space-y-4">
                {pets.map((pet, index) => (
                  <Card key={pet.id} className="border-2 border-dashed border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          Mascota #{index + 1}
                        </h4>
                        {pets.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePet(pet.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nombre *</label>
                          <Input
                            value={pet.name}
                            onChange={(e) => handlePetChange(pet.id, 'name', e.target.value)}
                            placeholder="Ej: Max"
                            className={errors[`pet_${index}_name`] ? 'border-red-500' : ''}
                          />
                          {errors[`pet_${index}_name`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`pet_${index}_name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Raza *</label>
                          <Input
                            value={pet.breed}
                            onChange={(e) => handlePetChange(pet.id, 'breed', e.target.value)}
                            placeholder="Ej: Golden Retriever"
                            className={errors[`pet_${index}_breed`] ? 'border-red-500' : ''}
                          />
                          {errors[`pet_${index}_breed`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`pet_${index}_breed`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Edad</label>
                          <Input
                            value={pet.age}
                            onChange={(e) => handlePetChange(pet.id, 'age', e.target.value)}
                            placeholder="Ej: 3 años"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Peso</label>
                          <Input
                            value={pet.weight}
                            onChange={(e) => handlePetChange(pet.id, 'weight', e.target.value)}
                            placeholder="Ej: 25 kg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Color</label>
                          <Input
                            value={pet.color}
                            onChange={(e) => handlePetChange(pet.id, 'color', e.target.value)}
                            placeholder="Ej: Dorado"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Notas</label>
                          <Input
                            value={pet.notes}
                            onChange={(e) => handlePetChange(pet.id, 'notes', e.target.value)}
                            placeholder="Comportamiento, alergias, etc."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notas Adicionales</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Información adicional sobre el cliente..."
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
                {client.id ? 'Actualizar' : 'Guardar'} Cliente
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}