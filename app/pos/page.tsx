'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
  CreditCard,
  Banknote,
  Receipt,
  User,
  Package,
} from 'lucide-react';
import { useServices } from '@/hooks/useService';
import { useProducts } from '@/hooks/useProduct';
import toast from 'react-hot-toast';
import { useClients } from '@/hooks/useClient';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const { services } = useServices();
  const { products } = useProducts();
  const { clients } = useClients();

  const allItems = [...services, ...products];

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              setSelectedClient('');
              toast.dismiss(t.id);
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
            {/* <Button className="bg-green-600 hover:bg-green-700">
              <Receipt className="h-4 w-4 mr-2" />
              Imprimir Ticket
            </Button> */}
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
                <Input
                  placeholder="Buscar cliente..."
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                />
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
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Procesar Venta
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}