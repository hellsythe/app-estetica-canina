'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Search,
  User,
  Calendar,
  Package,
  Scissors,
  Receipt,
  Clock,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react';

interface SearchPanelProps {
  searchTerm: string;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function SearchPanel({ searchTerm, onClose, onNavigate }: SearchPanelProps) {
  const [results, setResults] = useState({
    clients: [],
    appointments: [],
    products: [],
    services: [],
    invoices: []
  });

  // Mock data para la búsqueda
  const mockData = {
    clients: [
      {
        id: 1,
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        phone: '+1 (555) 123-4567',
        pet: 'Max (Golden Retriever)',
        lastVisit: '2024-01-15'
      },
      {
        id: 2,
        name: 'Carlos Ruiz',
        email: 'carlos.ruiz@email.com',
        phone: '+1 (555) 234-5678',
        pet: 'Luna (Poodle)',
        lastVisit: '2024-01-10'
      },
      {
        id: 3,
        name: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        phone: '+1 (555) 345-6789',
        pet: 'Rocky (Pastor Alemán)',
        lastVisit: '2024-01-08'
      }
    ],
    appointments: [
      {
        id: 1,
        client: 'María González',
        pet: 'Max',
        service: 'Baño y Corte Completo',
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'Confirmado'
      },
      {
        id: 2,
        client: 'Carlos Ruiz',
        pet: 'Luna',
        service: 'Corte de Uñas',
        date: '2024-01-16',
        time: '11:30 AM',
        status: 'Pendiente'
      }
    ],
    products: [
      {
        id: 1,
        name: 'Champú Antipulgas Premium',
        category: 'Higiene',
        price: 25.99,
        stock: 15,
        status: 'Disponible'
      },
      {
        id: 2,
        name: 'Acondicionador Hidratante',
        category: 'Higiene',
        price: 18.50,
        stock: 8,
        status: 'Stock Bajo'
      },
      {
        id: 3,
        name: 'Cortauñas Profesional',
        category: 'Herramientas',
        price: 45.00,
        stock: 3,
        status: 'Disponible'
      }
    ],
    services: [
      {
        id: 1,
        name: 'Baño y Corte Completo',
        price: 45,
        duration: 90,
        category: 'Completo'
      },
      {
        id: 2,
        name: 'Baño Básico',
        price: 25,
        duration: 45,
        category: 'Básico'
      },
      {
        id: 3,
        name: 'Corte de Uñas',
        price: 15,
        duration: 20,
        category: 'Básico'
      }
    ],
    invoices: [
      {
        id: 1,
        number: 'FAC-2024-001',
        client: 'María González',
        total: 82.35,
        date: '2024-01-15',
        status: 'Pagada'
      },
      {
        id: 2,
        number: 'FAC-2024-002',
        client: 'Carlos Ruiz',
        total: 46.40,
        date: '2024-01-16',
        status: 'Pendiente'
      }
    ]
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const term = searchTerm.toLowerCase();
      
      const filteredResults = {
        clients: mockData.clients.filter(client =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.includes(term) ||
          client.pet.toLowerCase().includes(term)
        ),
        appointments: mockData.appointments.filter(appointment =>
          appointment.client.toLowerCase().includes(term) ||
          appointment.pet.toLowerCase().includes(term) ||
          appointment.service.toLowerCase().includes(term)
        ),
        products: mockData.products.filter(product =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
        ),
        services: mockData.services.filter(service =>
          service.name.toLowerCase().includes(term) ||
          service.category.toLowerCase().includes(term)
        ),
        invoices: mockData.invoices.filter(invoice =>
          invoice.number.toLowerCase().includes(term) ||
          invoice.client.toLowerCase().includes(term)
        )
      };
      
      setResults(filteredResults);
    } else {
      setResults({
        clients: [],
        appointments: [],
        products: [],
        services: [],
        invoices: []
      });
    }
  }, [searchTerm]);

  const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
      case 'Confirmado':
      case 'Pagada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Stock Bajo':
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Agotado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {totalResults > 0 ? `${totalResults} resultados para "${searchTerm}"` : `Buscando "${searchTerm}"...`}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {totalResults === 0 && searchTerm.length > 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No se encontraron resultados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
            {/* Clientes */}
            {results.clients.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Clientes ({results.clients.length})
                </h3>
                <div className="space-y-2">
                  {results.clients.map((client) => (
                    <Card 
                      key={client.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => onNavigate('/clients')}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{client.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{client.pet}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{client.phone}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Citas */}
            {results.appointments.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Citas ({results.appointments.length})
                </h3>
                <div className="space-y-2">
                  {results.appointments.map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => onNavigate('/appointments')}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{appointment.client}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{appointment.service}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{appointment.time}</span>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Productos */}
            {results.products.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos ({results.products.length})
                </h3>
                <div className="space-y-2">
                  {results.products.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => onNavigate('/products')}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{product.category}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-green-600">${product.price}</span>
                          <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                            {product.stock} unidades
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios */}
            {results.services.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Servicios ({results.services.length})
                </h3>
                <div className="space-y-2">
                  {results.services.map((service) => (
                    <Card 
                      key={service.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => onNavigate('/services')}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{service.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{service.category}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-green-600">${service.price}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{service.duration} min</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Facturas */}
            {results.invoices.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Facturas ({results.invoices.length})
                </h3>
                <div className="space-y-2">
                  {results.invoices.map((invoice) => (
                    <Card 
                      key={invoice.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => onNavigate('/billing')}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{invoice.number}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{invoice.client}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-green-600">${invoice.total}</span>
                          <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {totalResults > 0 && (
          <div className="mt-4 pt-4 border-t dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Haz clic en cualquier resultado para navegar a la sección correspondiente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}