'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Save,
  Receipt,
  User,
  Building,
  Plus,
  Trash2,
  Search,
  Calculator,
  Percent,
  DollarSign
} from 'lucide-react';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: any;
  onSave: (invoice: any) => void;
}

export default function InvoiceForm({ isOpen, onClose, invoice, onSave }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    type: invoice?.type || 'factura',
    clientType: invoice?.clientType || 'general',
    clientName: invoice?.clientName || '',
    clientEmail: invoice?.clientEmail || '',
    clientPhone: invoice?.clientPhone || '',
    clientAddress: invoice?.clientAddress || '',
    clientTaxId: invoice?.clientTaxId || '',
    date: invoice?.date || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    paymentMethod: invoice?.paymentMethod || 'Efectivo',
    notes: invoice?.notes || '',
    discountType: 'percentage',
    discountValue: 0
  });

  const [items, setItems] = useState<InvoiceItem[]>(invoice?.items || []);
  const [errors, setErrors] = useState<any>({});
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Mock data - servicios y productos disponibles
  const availableServices = [
    { id: 1, name: 'Baño y Corte Completo', price: 45, type: 'service' },
    { id: 2, name: 'Baño Básico', price: 25, type: 'service' },
    { id: 3, name: 'Corte de Uñas', price: 15, type: 'service' },
    { id: 4, name: 'Spa Canino Premium', price: 85, type: 'service' },
    { id: 5, name: 'Corte Estilizado', price: 55, type: 'service' },
    { id: 6, name: 'Champú Antipulgas Premium', price: 25.99, type: 'product' },
    { id: 7, name: 'Acondicionador Hidratante', price: 18.50, type: 'product' },
    { id: 8, name: 'Perfume Canino Lavanda', price: 15.99, type: 'product' }
  ];

  // Mock data - clientes registrados
  const registeredClients = [
    {
      id: 1,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+1 (555) 123-4567',
      address: 'Calle Principal 123, Ciudad',
      taxId: 'RFC123456789'
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@email.com',
      phone: '+1 (555) 234-5678',
      address: 'Avenida Central 456, Ciudad',
      taxId: 'RFC987654321'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+1 (555) 345-6789',
      address: 'Boulevard Norte 789, Ciudad',
      taxId: 'RFC456789123'
    }
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
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: client.address,
      clientTaxId: client.taxId
    }));
  };

  const addItem = (service?: any) => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: service?.name || '',
      quantity: 1,
      price: service?.price || 0,
      total: service?.price || 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (formData.discountType === 'percentage') {
      return (subtotal * formData.discountValue) / 100;
    }
    return formData.discountValue;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return (subtotal - discount) * 0.16; // 16% IVA
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const generateInvoiceNumber = () => {
    const prefix = formData.type === 'factura' ? 'FAC' : 'TIC';
    const year = new Date().getFullYear();
    const number = Math.floor(Math.random() * 1000) + 1;
    return `${prefix}-${year}-${number.toString().padStart(3, '0')}`;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    }

    if (formData.type === 'factura' && formData.clientType === 'registered' && !formData.clientTaxId.trim()) {
      newErrors.clientTaxId = 'El RFC es requerido para facturas';
    }

    if (items.length === 0) {
      newErrors.items = 'Debe agregar al menos un artículo';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount();
      const tax = calculateTax();
      const total = calculateTotal();

      const invoiceData = {
        ...formData,
        id: invoice?.id || Date.now(),
        number: invoice?.number || generateInvoiceNumber(),
        items: items,
        subtotal: subtotal,
        tax: tax,
        discount: discount,
        total: total,
        status: invoice?.status || 'pending'
      };
      
      onSave(invoiceData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {invoice ? 'Editar Factura' : 'Nueva Factura'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tipo de Documento</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-colors ${
                    formData.type === 'factura' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleInputChange('type', 'factura')}
                >
                  <CardContent className="p-4 text-center">
                    <Receipt className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold">Factura</h4>
                    <p className="text-sm text-gray-600">Comprobante fiscal completo</p>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer transition-colors ${
                    formData.type === 'ticket' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleInputChange('type', 'ticket')}
                >
                  <CardContent className="p-4 text-center">
                    <Receipt className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">Ticket</h4>
                    <p className="text-sm text-gray-600">Comprobante de venta simple</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Información del Cliente</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.clientType === 'general' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('clientType', 'general')}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Público General
                  </Button>
                  <Button
                    type="button"
                    variant={formData.clientType === 'registered' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('clientType', 'registered')}
                  >
                    <Building className="h-4 w-4 mr-1" />
                    Cliente Registrado
                  </Button>
                </div>
              </div>

              {formData.clientType === 'registered' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Seleccionar Cliente</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {registeredClients.map(client => (
                      <Card
                        key={client.id}
                        className={`cursor-pointer transition-colors ${
                          selectedClient?.id === client.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleClientSelect(client)}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.phone}</p>
                          <p className="text-sm text-gray-600">{client.taxId}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-2">Teléfono</label>
                  <Input
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
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

                {formData.type === 'factura' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">RFC {formData.clientType === 'registered' && '*'}</label>
                    <Input
                      value={formData.clientTaxId}
                      onChange={(e) => handleInputChange('clientTaxId', e.target.value)}
                      placeholder="RFC123456789"
                      className={errors.clientTaxId ? 'border-red-500' : ''}
                    />
                    {errors.clientTaxId && <p className="text-red-500 text-xs mt-1">{errors.clientTaxId}</p>}
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Dirección</label>
                  <Input
                    value={formData.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    placeholder="Dirección completa"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de la Factura</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Emisión</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Vencimiento *</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className={errors.dueDate ? 'border-red-500' : ''}
                  />
                  {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Método de Pago</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Artículos</h3>
                <Button type="button" onClick={() => addItem()} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Artículo
                </Button>
              </div>

              {/* Quick Add Services */}
              <div>
                <label className="block text-sm font-medium mb-2">Agregar Servicio/Producto Rápido</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableServices.slice(0, 8).map(service => (
                    <Button
                      key={service.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(service)}
                      className="text-left justify-start h-auto p-2"
                    >
                      <div>
                        <p className="text-xs font-medium">{service.name}</p>
                        <p className="text-xs text-gray-500">${service.price}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <Card key={item.id} className="border-2 border-dashed border-gray-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Descripción</label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Descripción del artículo"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Cantidad</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Precio Unitario</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium mb-2">Total</label>
                            <p className="text-lg font-bold text-green-600">${item.total.toFixed(2)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}
            </div>

            {/* Discount */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Descuento (Opcional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Descuento</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => handleInputChange('discountType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Cantidad Fija ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Valor del Descuento</label>
                  <div className="relative">
                    {formData.discountType === 'percentage' ? (
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                    <Input
                      type="number"
                      step={formData.discountType === 'percentage' ? '1' : '0.01'}
                      value={formData.discountValue}
                      onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                      className="pl-10"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descuento Aplicado</label>
                  <p className="text-lg font-bold text-red-600">${calculateDiscount().toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Resumen</h3>
              
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Descuento:</span>
                        <span className="font-medium">-${calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>IVA (16%):</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notas Adicionales</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas o comentarios adicionales..."
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
                {invoice ? 'Actualizar' : 'Crear'} {formData.type === 'factura' ? 'Factura' : 'Ticket'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}