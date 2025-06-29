'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CouponForm from '@/components/forms/CouponForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Ticket, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'BIENVENIDO20',
      name: 'Descuento de Bienvenida',
      description: 'Descuento del 20% para nuevos clientes',
      type: 'percentage',
      value: 20,
      minAmount: 30,
      maxDiscount: 15,
      usageLimit: 100,
      usedCount: 23,
      validFrom: '2024-01-01',
      validUntil: '2024-03-31',
      status: 'active',
      applicableServices: ['Baño y Corte Completo', 'Corte Estilizado'],
      createdDate: '2024-01-01'
    },
    {
      id: 2,
      code: 'VERANO2024',
      name: 'Promoción de Verano',
      description: 'Descuento fijo de $10 en servicios premium',
      type: 'fixed',
      value: 10,
      minAmount: 40,
      maxDiscount: 10,
      usageLimit: 50,
      usedCount: 45,
      validFrom: '2024-01-15',
      validUntil: '2024-02-29',
      status: 'active',
      applicableServices: ['Spa Canino', 'Corte Estilizado'],
      createdDate: '2024-01-10'
    },
    {
      id: 3,
      code: 'CLIENTE_VIP',
      name: 'Descuento VIP',
      description: '25% de descuento para clientes VIP',
      type: 'percentage',
      value: 25,
      minAmount: 0,
      maxDiscount: 25,
      usageLimit: null,
      usedCount: 12,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      status: 'active',
      applicableServices: ['Todos los servicios'],
      createdDate: '2024-01-01'
    },
    {
      id: 4,
      code: 'NAVIDAD2023',
      name: 'Promoción Navideña',
      description: 'Descuento especial de temporada',
      type: 'percentage',
      value: 15,
      minAmount: 25,
      maxDiscount: 20,
      usageLimit: 200,
      usedCount: 187,
      validFrom: '2023-12-01',
      validUntil: '2023-12-31',
      status: 'expired',
      applicableServices: ['Baño y Corte Completo', 'Baño Básico'],
      createdDate: '2023-11-25'
    },
    {
      id: 5,
      code: 'PROMO_PAUSA',
      name: 'Promoción en Pausa',
      description: 'Descuento temporal pausado',
      type: 'fixed',
      value: 5,
      minAmount: 20,
      maxDiscount: 5,
      usageLimit: 30,
      usedCount: 8,
      validFrom: '2024-01-20',
      validUntil: '2024-04-20',
      status: 'paused',
      applicableServices: ['Corte de Uñas', 'Baño Básico'],
      createdDate: '2024-01-15'
    }
  ]);

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && coupon.status === selectedFilter;
  });

  const handleAddCoupon = () => {
    setSelectedCoupon(null);
    setIsFormOpen(true);
  };

  const handleEditCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleSaveCoupon = (couponData: any) => {
    if (selectedCoupon) {
      // Update existing coupon
      setCoupons(prev => prev.map(coupon => 
        coupon.id === couponData.id ? couponData : coupon
      ));
    } else {
      // Add new coupon
      setCoupons(prev => [...prev, couponData]);
    }
  };

  const handleDeleteCoupon = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cupón?')) {
      setCoupons(prev => prev.filter(coupon => coupon.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'expired':
        return 'Expirado';
      case 'paused':
        return 'Pausado';
      default:
        return 'Desconocido';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />;
  };

  const formatValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Aquí podrías agregar una notificación de éxito
  };

  const toggleCouponStatus = (id: number) => {
    setCoupons(prev => prev.map(coupon => {
      if (coupon.id === id) {
        const newStatus = coupon.status === 'active' ? 'paused' : 'active';
        return { ...coupon, status: newStatus };
      }
      return coupon;
    }));
  };

  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const totalSavings = coupons.reduce((sum, c) => {
    if (c.type === 'percentage') {
      return sum + (c.usedCount * (c.maxDiscount || 0));
    }
    return sum + (c.usedCount * c.value);
  }, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cupones de Descuento</h1>
            <p className="text-gray-600">Gestiona cupones y promociones para tus clientes</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCoupon}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Cupón
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar cupones por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={selectedFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('active')}
            >
              Activos
            </Button>
            <Button 
              variant={selectedFilter === 'paused' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('paused')}
            >
              Pausados
            </Button>
            <Button 
              variant={selectedFilter === 'expired' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('expired')}
            >
              Expirados
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cupones Activos</CardTitle>
              <Ticket className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCoupons}</div>
              <p className="text-xs text-gray-500">De {coupons.length} totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usos Totales</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsage}</div>
              <p className="text-xs text-gray-500">Cupones utilizados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ahorros Generados</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSavings}</div>
              <p className="text-xs text-gray-500">Descuentos aplicados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-gray-500">Cupones vs ventas</p>
            </CardContent>
          </Card>
        </div>

        {/* Coupons List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cupones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCoupons.map((coupon) => (
                <div key={coupon.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-semibold">
                            {coupon.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(coupon.code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge className={getStatusColor(coupon.status)}>
                          {getStatusText(coupon.status)}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">{coupon.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            {getTypeIcon(coupon.type)}
                            <span className="ml-2 font-medium">
                              Descuento: {formatValue(coupon.type, coupon.value)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Compra mínima: ${coupon.minAmount}
                          </div>
                          {coupon.maxDiscount && (
                            <div className="text-sm text-gray-600">
                              Descuento máximo: ${coupon.maxDiscount}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Válido: {coupon.validFrom} - {coupon.validUntil}
                          </div>
                          <div className="text-sm text-gray-600">
                            Usos: {coupon.usedCount} / {coupon.usageLimit || '∞'}
                          </div>
                          {coupon.usageLimit && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Servicios aplicables:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {coupon.applicableServices.map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCouponStatus(coupon.id)}
                        title={coupon.status === 'active' ? 'Pausar cupón' : 'Activar cupón'}
                      >
                        {coupon.status === 'active' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCoupon(coupon)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteCoupon(coupon.id)}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddCoupon}>
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Crear Cupón</h3>
              <p className="text-sm text-gray-600">Nuevo cupón de descuento</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Estadísticas</h3>
              <p className="text-sm text-gray-600">Análisis de rendimiento</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-1">Campañas</h3>
              <p className="text-sm text-gray-600">Promociones masivas</p>
            </CardContent>
          </Card>
        </div>

        {/* Coupon Form Modal */}
        <CouponForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          coupon={selectedCoupon}
          onSave={handleSaveCoupon}
        />
      </div>
    </DashboardLayout>
  );
}