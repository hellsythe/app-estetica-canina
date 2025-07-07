'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SaleConfirmationModal from '@/components/pos/SaleConfirmationModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Trash2,
  Calculator,
  User,
  Package,
  X,
  Check,
  Phone,
  Mail,
} from 'lucide-react';
import { useServices } from '@/hooks/useService';
import { useProducts } from '@/hooks/useProduct';
import toast from 'react-hot-toast';
import { useClients } from '@/hooks/useClient';
import { Client } from '@/lib/api/services/client/client';
import { CartItem } from '@/lib/api/services/sale/sale';
import { useSales } from '@/hooks/useSale';

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [showSaleConfirmation, setShowSaleConfirmation] = useState(false);
  const [newClientData, setNewClientData] = useState(new Client());
  const [newClientErrors, setNewClientErrors] = useState<any>({});

  const { services } = useServices();
  const { products } = useProducts();
  const { clients, createClient } = useClients();
  const { createSale } = useSales();
  const allItems = [...services, ...products];

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar clientes basado en el término de búsqueda
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.phoneNumber.includes(clientSearchTerm)
  );

  const addToCart = (item: typeof allItems[0]) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  const clearCart = () => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-semibold">¿Estás seguro de que quieres limpiar el carrito?</p>
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
              setCart([]);
              setSelectedClient(null);
              setClientSearchTerm('');
              toast.dismiss(t.id);
            }}
          >
            Limpiar
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

  const handleClientSearch = (value: string) => {
    setClientSearchTerm(value);
    setShowClientDropdown(value.length > 0);
    setShowNewClientForm(false);

    // Si está buscando, limpiar la selección actual
    if (selectedClient && !value.includes(selectedClient.name)) {
      setSelectedClient(null);
    }
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setClientSearchTerm(client.name);
    setShowClientDropdown(false);
    setShowNewClientForm(false);
  };

  const handleNewClientChange = (field: string, value: string) => {
    setNewClientData(prev => ({
      ...prev,
      [field]: value
    }));

    if (newClientErrors[field]) {
      setNewClientErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateNewClient = () => {
    const errors: any = {};

    if (!newClientData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    if (!newClientData.phoneNumber.trim()) {
      errors.phoneNumber = 'El teléfono es requerido';
    }

    if (newClientData.email && !/\S+@\S+\.\S+/.test(newClientData.email)) {
      errors.email = 'Email inválido';
    }

    setNewClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateNewClient = async () => {
    if (validateNewClient()) {
      try {
        const newClient = await createClient({
          ...newClientData,
          pets: [],
          notes: '',
          status: 'Activo'
        });

        setSelectedClient(newClient);
        setClientSearchTerm(newClient.name);
        setShowNewClientForm(false);
        setShowClientDropdown(false);
        setNewClientData(new Client());

        toast.success('Cliente creado exitosamente');
      } catch (error) {
        toast.error('Error al crear el cliente');
      }
    }
  };

  const handleProcessSale = () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setShowSaleConfirmation(true);
  };

  const handleConfirmSale = async (saleData: any) => {
    try {
      // Aquí enviarías los datos al backend
      console.log('Datos de venta:', saleData);

     await createSale(saleData);

      // Simular llamada al backend
      toast.success(`Venta procesada exitosamente - ${saleData.saleNumber}`);

      // Limpiar después de procesar
     setCart([]);
     setSelectedClient(null);
     setClientSearchTerm('');
    } catch (error) {
      toast.error('Error al procesar la venta');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Punto de Venta</h1>
            <p className="text-gray-600">Sistema de ventas para servicios y productos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCart}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products and Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar servicios o productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => addToCart(item)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={item.type === 'service' ? 'default' : 'secondary'}>
                        {item.type === 'service' ? 'Servicio' : 'Producto'}
                      </Badge>
                      <div className="flex items-center">
                        {item.type === 'service' ? (
                          <Calculator className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-2xl font-bold text-green-600">${item.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="space-y-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative">
                  {/* Client Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar cliente por nombre, email o teléfono..."
                      value={clientSearchTerm}
                      onChange={(e) => handleClientSearch(e.target.value)}
                      onFocus={() => clientSearchTerm && setShowClientDropdown(true)}
                      className="pl-10"
                    />
                    {selectedClient && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedClient(null);
                          setClientSearchTerm('');
                          setShowClientDropdown(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Client Dropdown */}
                  {showClientDropdown && !selectedClient && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        <>
                          {filteredClients.map(client => (
                            <div
                              key={client.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleClientSelect(client)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{client.name}</h4>
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {client.phoneNumber}
                                    </div>
                                    {client.email && (
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-3 w-3 mr-1" />
                                        {client.email}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="p-3 border-t border-gray-200">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setShowNewClientForm(true);
                                setShowClientDropdown(false);
                                setNewClientData({
                                  name: clientSearchTerm,
                                  email: '',
                                  phoneNumber: '',
                                  address: ''
                                });
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar nuevo cliente
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 relative" style={{ position: 'relative' }}>
                          <p className="text-sm text-gray-500 mb-3">No se encontraron clientes</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setShowNewClientForm(true);
                              setShowClientDropdown(false);
                              setNewClientData({
                                name: clientSearchTerm,
                                email: '',
                                phoneNumber: '',
                                address: ''
                              });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Crear cliente "{clientSearchTerm}"
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Client Info */}
                  {selectedClient && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900">{selectedClient.name}</h4>
                            <div className="space-y-1 mt-2">
                              <div className="flex items-center text-sm text-blue-800">
                                <Phone className="h-3 w-3 mr-2" />
                                {selectedClient.phoneNumber}
                              </div>
                              {selectedClient.email && (
                                <div className="flex items-center text-sm text-blue-800">
                                  <Mail className="h-3 w-3 mr-2" />
                                  {selectedClient.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* New Client Form */}
                  {showNewClientForm && (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm text-green-800">Nuevo Cliente</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowNewClientForm(false);
                              setNewClientData({ name: '', email: '', phoneNumber: '', address: '' });
                              setNewClientErrors({});
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Input
                            placeholder="Nombre completo *"
                            value={newClientData.name}
                            onChange={(e) => handleNewClientChange('name', e.target.value)}
                            className={newClientErrors.name ? 'border-red-500' : ''}
                          />
                          {newClientErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{newClientErrors.name}</p>
                          )}
                        </div>

                        <div>
                          <Input
                            placeholder="Teléfono *"
                            value={newClientData.phoneNumber}
                            onChange={(e) => handleNewClientChange('phoneNumber', e.target.value)}
                            className={newClientErrors.phoneNumber ? 'border-red-500' : ''}
                          />
                          {newClientErrors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1">{newClientErrors.phoneNumber}</p>
                          )}
                        </div>

                        <div>
                          <Input
                            placeholder="Email (opcional)"
                            type="email"
                            value={newClientData.email}
                            onChange={(e) => handleNewClientChange('email', e.target.value)}
                            className={newClientErrors.email ? 'border-red-500' : ''}
                          />
                          {newClientErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{newClientErrors.email}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setShowNewClientForm(false);
                              setNewClientData({ name: '', email: '', phoneNumber: '', address: '' });
                              setNewClientErrors({});
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handleCreateNewClient}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Crear
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Carrito vacío</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">${item.price} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Total */}
            <Card>
              <CardContent>
                <div className="space-y-2">
                  <div className="pt-2 mt-6">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Sale */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              disabled={cart.length === 0}
              onClick={handleProcessSale}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Procesar Venta
            </Button>
          </div>
        </div>

        {/* Sale Confirmation Modal */}
        <SaleConfirmationModal
          isOpen={showSaleConfirmation}
          onClose={() => setShowSaleConfirmation(false)}
          onConfirm={handleConfirmSale}
          cart={cart}
          selectedClient={selectedClient}
          subtotal={subtotal}
          total={total}
        />
      </div>
    </DashboardLayout>
  );
}