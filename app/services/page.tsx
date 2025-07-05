'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ServiceForm from '@/components/forms/ServiceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Scissors,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Trash2
} from 'lucide-react';
import { Service } from '@/lib/api/services/service/service';
import { useServices } from '@/hooks/useService';
import toast from 'react-hot-toast';

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service>(new Service());
  // const [services, setServices] = useState([
  //   {
  //     id: 1,
  //     name: 'Baño y Corte Completo',
  //     description: 'Servicio completo que incluye baño, secado, corte de pelo y uñas',
  //     price: 45,
  //     duration: 90,
  //     category: 'Completo',
  //     popularity: 95,
  //     status: 'Activo',
  //     includes: 'Baño con champú especializado, secado, corte de pelo, corte de uñas, limpieza de oídos',
  //     requirements: 'Mascota vacunada, traer correa'
  //   },
  //   {
  //     id: 2,
  //     name: 'Baño Básico',
  //     description: 'Baño con champú especializado y secado',
  //     price: 25,
  //     duration: 45,
  //     category: 'Básico',
  //     popularity: 88,
  //     status: 'Activo',
  //     includes: 'Baño con champú, secado básico',
  //     requirements: 'Mascota vacunada'
  //   },
  //   {
  //     id: 3,
  //     name: 'Corte de Uñas',
  //     description: 'Corte profesional de uñas y lima',
  //     price: 15,
  //     duration: 20,
  //     category: 'Básico',
  //     popularity: 72,
  //     status: 'Activo',
  //     includes: 'Corte de uñas, lima, revisión de almohadillas',
  //     requirements: 'Ninguno especial'
  //   },
  //   {
  //     id: 4,
  //     name: 'Tratamiento Antipulgas',
  //     description: 'Baño medicinal con productos antipulgas y antiparasitarios',
  //     price: 35,
  //     duration: 60,
  //     category: 'Medicinal',
  //     popularity: 65,
  //     status: 'Activo',
  //     includes: 'Baño medicinal, tratamiento antipulgas, secado',
  //     requirements: 'Consulta veterinaria previa recomendada'
  //   },
  //   {
  //     id: 5,
  //     name: 'Corte Estilizado',
  //     description: 'Corte de pelo con estilo personalizado según la raza',
  //     price: 55,
  //     duration: 120,
  //     category: 'Premium',
  //     popularity: 78,
  //     status: 'Activo',
  //     includes: 'Consulta de estilo, corte personalizado, acabado profesional',
  //     requirements: 'Cita previa, mascota socializada'
  //   },
  //   {
  //     id: 6,
  //     name: 'Spa Canino',
  //     description: 'Tratamiento completo de relajación y belleza',
  //     price: 85,
  //     duration: 180,
  //     category: 'Premium',
  //     popularity: 45,
  //     status: 'Promocional',
  //     includes: 'Baño relajante, masaje, aromaterapia, corte, manicura',
  //     requirements: 'Reserva con 48 horas de anticipación'
  //   }
  // ]);

  const { services, createService, updateService, deleteService } = useServices();

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryColors = {
    'Básico': 'bg-blue-100 text-blue-800',
    'Completo': 'bg-green-100 text-green-800',
    'Medicinal': 'bg-yellow-100 text-yellow-800',
    'Premium': 'bg-purple-100 text-purple-800',
    'Estético': 'bg-pink-100 text-pink-800',
    'Especial': 'bg-orange-100 text-orange-800'
  };

  const handleAddService = () => {
    setSelectedService(new Service());
    setIsFormOpen(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleSaveService = async (serviceData: any) => {
    if (selectedService.id) {
      await updateService(selectedService.id, serviceData);
      toast.success('Servicio actualizado correctamente');
    } else {
      await createService(serviceData);
      toast.success('Servicio guardado correctamente');
    }
  };

  // const handleDeleteService = (id: number) => {
  //   if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
  //     setServices(prev => prev.filter(service => service.id !== id));
  //   }
  // };

  const handleDeleteService = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-semibold">¿Estás seguro de que quieres eliminar este Servicio?</p>
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
              deleteService(id);
              toast.dismiss(t.id);
              toast.success('Servicio eliminado correctamente');
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

  const getMostPopularService = () => {
    if (services.length === 0) return new Service();
    return services.reduce((prev, current) => {
      return (prev.popularity > current.popularity) ? prev : current;
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
            <p className="text-gray-600">Gestiona el catálogo de servicios de tu estética</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddService}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Servicio
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Todos</Button>
            <Button variant="outline">Básico</Button>
            <Button variant="outline">Premium</Button>
            <Button variant="outline">Medicinal</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Servicios</CardTitle>
              <Scissors className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)}</div>
              {/* <p className="text-xs text-gray-500">+8% vs mes anterior</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duración Promedio</CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)} min</div>
              <p className="text-xs text-gray-500">Tiempo estándar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Más Popular</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getMostPopularService().popularity}%</div>
              <p className="text-xs text-gray-500">{getMostPopularService().name}</p>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[service.category]}`}>
                      {service.category}
                    </span>
                    <Badge variant={service.status === 'Activo' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">${service.price}</p>
                      <p className="text-xs text-gray-500">Precio</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{service.duration}</p>
                      <p className="text-xs text-gray-500">Minutos</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Popularidad</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium">{service.popularity}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${service.popularity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Form Modal */}
        <ServiceForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          service={selectedService}
          onSave={handleSaveService}
        />
      </div>
    </DashboardLayout>
  );
}