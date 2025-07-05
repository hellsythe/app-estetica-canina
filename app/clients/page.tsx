'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientForm from '@/components/forms/ClientForm';
import SyncStatusIndicator from '@/components/ui/SyncStatusIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Phone,
  Mail,
  Heart,
  Calendar,
  Trash2,
} from 'lucide-react';
import { useClients } from '@/hooks/useClient';
import { Client } from '@/lib/api/services/client/client';
import toast from 'react-hot-toast';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client>(new Client());

  const { clients, createClient, updateClient, deleteClient } = useClients();

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.pets?.some((pet: any) => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClient = () => {
    setSelectedClient(new Client());
    setIsFormOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleSaveClient =  async (clientData: any) => {
    if (selectedClient.id) {
      await updateClient(selectedClient.id, clientData);
      toast.success('Cliente actualizado correctamente');
    } else {
      await createClient(clientData);
      toast.success('Empleado guardado correctamente');
    }
  };

  const handleDeleteClient = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-semibold">¿Estás seguro de que quieres eliminar este cliente?</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              deleteClient(id);
              toast.dismiss(t.id);
              toast.success('Empleado eliminado correctamente');
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#fff',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    });
  };

  const activeClientsCount = clients.filter(c => c.status === 'Activo').length;
  const totalClients = clients.length;
  const activeClientsPercentage = totalClients > 0
    ? Math.round((activeClientsCount / totalClients) * 100)
    : 0;

  const totalPets = clients.reduce((sum, c) => sum + (c.pets?.length || 0), 0);
  const averagePetsPerClient = totalClients > 0
    ? (totalPets / totalClients).toFixed(2)
    : 0;

  // Calcula el porcentaje de clientes VIP
  const vipClientsCount = clients.filter(c => c.type === 'VIP').length;
  const vipClientsPercentage = totalClients > 0
    ? Math.round((vipClientsCount / totalClients) * 100)
    : 0;
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">Gestiona tu base de clientes y sus mascotas</p>
              {/* {!syncStatus.isOnline && (
                <div className="flex items-center gap-2 text-amber-600">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm">Modo offline</span>
                </div>
              )} */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SyncStatusIndicator showDetails={false} />
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddClient}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cliente
            </Button>
          </div>
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
              {/* <p className="text-xs text-gray-500">
                {syncStatus.isOnline ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Sincronizado
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <WifiOff className="h-3 w-3 text-amber-500" />
                    Offline
                  </span>
                )}
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClientsCount}</div>
              <p className="text-xs text-gray-500">{activeClientsPercentage}% activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
              <Heart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vipClientsCount}</div>
              <p className="text-xs text-gray-500">{vipClientsPercentage}% del total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mascotas Registradas</CardTitle>
              <Heart className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPets}</div>
              <p className="text-xs text-gray-500">{averagePetsPerClient} promedio por cliente</p>
            </CardContent>
          </Card>
        </div>

        {/* Sync Status Details */}
        {/* {syncStatus.pendingSync > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">
                      {syncStatus.pendingSync} cambios pendientes de sincronización
                    </p>
                    <p className="text-sm text-amber-600">
                      Los cambios se guardarán localmente y se sincronizarán cuando vuelva la conexión
                    </p>
                  </div>
                </div>
                <SyncStatusIndicator showDetails={true} className="w-64" />
              </div>
            </CardContent>
          </Card>
        )} */}

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
                        {/* <Badge variant={
                          client.status === 'VIP' ? 'default' :
                          client.status === 'Activo' ? 'secondary' : 'outline'
                        }>
                          {client.status}
                        </Badge>
                        {!syncStatus.isOnline && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            <WifiOff className="h-3 w-3 mr-1" />
                            Local
                          </Badge>
                        )} */}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {client.phoneNumber}
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
                          {client.pets?.map((pet: any, index: number) => (
                            <div key={index} className="bg-blue-50 px-3 py-1 rounded-full text-sm">
                              <span className="font-medium">{pet.name}</span>
                              <span className="text-gray-600"> - {pet.breed}, {pet.age}</span>
                            </div>
                          )) || (
                            <span className="text-gray-500 text-sm">Sin mascotas registradas</span>
                          )}
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

              {filteredClients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No se encontraron clientes que coincidan con la búsqueda' : 'No hay clientes registrados'}
                </div>
              )}
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