'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientForm from '@/components/forms/ClientForm';
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
  Phone,
  Mail,
  MapPin,
  Heart,
  Calendar,
  Trash2
} from 'lucide-react';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+1 (555) 123-4567',
      address: 'Calle Principal 123, Ciudad',
      pets: [
        { name: 'Max', breed: 'Golden Retriever', age: '3 años' },
        { name: 'Bella', breed: 'Labrador', age: '2 años' }
      ],
      lastVisit: '2024-01-15',
      totalVisits: 12,
      status: 'Activo',
      emergencyContact: 'Carlos González',
      emergencyPhone: '+1 (555) 111-2222'
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@email.com',
      phone: '+1 (555) 234-5678',
      address: 'Avenida Central 456, Ciudad',
      pets: [
        { name: 'Luna', breed: 'Poodle', age: '4 años' }
      ],
      lastVisit: '2024-01-10',
      totalVisits: 8,
      status: 'Activo',
      emergencyContact: 'Ana Ruiz',
      emergencyPhone: '+1 (555) 222-3333'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+1 (555) 345-6789',
      address: 'Boulevard Norte 789, Ciudad',
      pets: [
        { name: 'Rocky', breed: 'Pastor Alemán', age: '5 años' },
        { name: 'Coco', breed: 'Chihuahua', age: '1 año' }
      ],
      lastVisit: '2024-01-08',
      totalVisits: 15,
      status: 'VIP',
      emergencyContact: 'Luis Martínez',
      emergencyPhone: '+1 (555) 333-4444'
    },
    {
      id: 4,
      name: 'Luis Fernández',
      email: 'luis.fernandez@email.com',
      phone: '+1 (555) 456-7890',
      address: 'Calle Sur 321, Ciudad',
      pets: [
        { name: 'Toby', breed: 'Beagle', age: '2 años' }
      ],
      lastVisit: '2023-12-20',
      totalVisits: 5,
      status: 'Inactivo',
      emergencyContact: 'Carmen Fernández',
      emergencyPhone: '+1 (555) 444-5555'
    }
  ]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.pets.some(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleSaveClient = (clientData: any) => {
    if (selectedClient) {
      // Update existing client
      setClients(prev => prev.map(client => 
        client.id === clientData.id ? clientData : client
      ));
    } else {
      // Add new client
      setClients(prev => [...prev, clientData]);
    }
  };

  const handleDeleteClient = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Gestiona tu base de clientes y sus mascotas</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddClient}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Cliente
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes o mascotas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Todos</Button>
            <Button variant="outline">Activos</Button>
            <Button variant="outline">VIP</Button>
            <Button variant="outline">Inactivos</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-gray-500">+8 este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.filter(c => c.status === 'Activo').length}</div>
              <p className="text-xs text-gray-500">94% activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
              <Heart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.filter(c => c.status === 'VIP').length}</div>
              <p className="text-xs text-gray-500">11% del total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mascotas Registradas</CardTitle>
              <Heart className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.reduce((sum, c) => sum + c.pets.length, 0)}</div>
              <p className="text-xs text-gray-500">1.45 promedio por cliente</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <Badge variant={
                          client.status === 'VIP' ? 'default' : 
                          client.status === 'Activo' ? 'secondary' : 'outline'
                        }>
                          {client.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {client.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {client.address}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Última visita: {client.lastVisit}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total de visitas: {client.totalVisits}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Mascotas:</p>
                        <div className="flex flex-wrap gap-2">
                          {client.pets.map((pet, index) => (
                            <div key={index} className="bg-blue-50 px-3 py-1 rounded-full text-sm">
                              <span className="font-medium">{pet.name}</span>
                              <span className="text-gray-600"> - {pet.breed}, {pet.age}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteClient(client.id)}
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

        {/* Client Form Modal */}
        <ClientForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          client={selectedClient}
          onSave={handleSaveClient}
        />
      </div>
    </DashboardLayout>
  );
}