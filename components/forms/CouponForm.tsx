'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Save,
  Ticket,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Shuffle
} from 'lucide-react';

interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: any;
  onSave: (coupon: any) => void;
}

export default function CouponForm({ isOpen, onClose, coupon, onSave }: CouponFormProps) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    name: coupon?.name || '',
    description: coupon?.description || '',
    type: coupon?.type || 'percentage',
    value: coupon?.value || '',
    minAmount: coupon?.minAmount || '',
    maxDiscount: coupon?.maxDiscount || '',
    usageLimit: coupon?.usageLimit || '',
    validFrom: coupon?.validFrom || new Date().toISOString().split('T')[0],
    validUntil: coupon?.validUntil || '',
    status: coupon?.status || 'active',
    applicableServices: coupon?.applicableServices || ['Todos los servicios']
  });

  const [errors, setErrors] = useState<any>({});

  const services = [
    'Todos los servicios',
    'Baño y Corte Completo',
    'Baño Básico',
    'Corte de Uñas',
    'Spa Canino',
    'Corte Estilizado',
    'Tratamiento Antipulgas'
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

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const services = prev.applicableServices;
      if (service === 'Todos los servicios') {
        return { ...prev, applicableServices: ['Todos los servicios'] };
      }
      
      const filtered = services.filter(s => s !== 'Todos los servicios');
      if (filtered.includes(service)) {
        const newServices = filtered.filter(s => s !== service);
        return { 
          ...prev, 
          applicableServices: newServices.length === 0 ? ['Todos los servicios'] : newServices 
        };
      } else {
        return { ...prev, applicableServices: [...filtered, service] };
      }
    });
  };

  const generateCode = () => {
    const prefixes = ['SAVE', 'DISC', 'PROMO', 'OFFER', 'DEAL'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 90) + 10;
    const code = `${prefix}${number}`;
    setFormData(prev => ({ ...prev, code }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.code.trim()) {
      newErrors.code = 'El código del cupón es requerido';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del cupón es requerido';
    }

    if (!formData.value.trim()) {
      newErrors.value = 'El valor del descuento es requerido';
    } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = 'El valor debe ser un número válido mayor a 0';
    }

    if (formData.type === 'percentage' && Number(formData.value) > 100) {
      newErrors.value = 'El porcentaje no puede ser mayor a 100%';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'La fecha de vencimiento es requerida';
    } else if (new Date(formData.validUntil) <= new Date(formData.validFrom)) {
      newErrors.validUntil = 'La fecha de vencimiento debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const couponData = {
        ...formData,
        id: coupon?.id || Date.now(),
        value: Number(formData.value),
        minAmount: Number(formData.minAmount) || 0,
        maxDiscount: Number(formData.maxDiscount) || null,
        usageLimit: Number(formData.usageLimit) || null,
        usedCount: coupon?.usedCount || 0,
        createdDate: coupon?.createdDate || new Date().toISOString().split('T')[0]
      };
      
      onSave(couponData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              {coupon ? 'Editar Cupón' : 'Crear Cupón'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Código del Cupón *</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                      placeholder="BIENVENIDO20"
                      className={`flex-1 font-mono ${errors.code ? 'border-red-500' : ''}`}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={generateCode}>
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del Cupón *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Descuento de Bienvenida"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción del cupón para mostrar a los clientes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Configuración del Descuento</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Descuento</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Cantidad Fija ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Valor del Descuento * {formData.type === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <div className="relative">
                    {formData.type === 'percentage' ? (
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                    <Input
                      type="number"
                      step={formData.type === 'percentage' ? '1' : '0.01'}
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                      placeholder={formData.type === 'percentage' ? '20' : '10.00'}
                      className={`pl-10 ${errors.value ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Compra Mínima ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.minAmount}
                    onChange={(e) => handleInputChange('minAmount', e.target.value)}
                    placeholder="30.00"
                  />
                </div>
              </div>

              {formData.type === 'percentage' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Descuento Máximo ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.maxDiscount}
                      onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                      placeholder="15.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Opcional: límite máximo del descuento</p>
                  </div>
                </div>
              )}
            </div>

            {/* Usage and Validity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Uso y Validez</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Inicio *</label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Vencimiento *</label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleInputChange('validUntil', e.target.value)}
                    className={errors.validUntil ? 'border-red-500' : ''}
                  />
                  {errors.validUntil && <p className="text-red-500 text-xs mt-1">{errors.validUntil}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Límite de Usos</label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Dejar vacío para uso ilimitado</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="expired">Expirado</option>
                </select>
              </div>
            </div>

            {/* Applicable Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Servicios Aplicables</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.applicableServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={service} className="text-sm text-gray-700">
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {coupon ? 'Actualizar' : 'Crear'} Cupón
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}