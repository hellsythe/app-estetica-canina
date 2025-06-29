'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Save,
  BarChart3,
  FileText,
  PieChart,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Scissors,
  Package,
  Clock,
  Target
} from 'lucide-react';

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  report?: any;
  onSave: (report: any) => void;
}

export default function ReportForm({ isOpen, onClose, report, onSave }: ReportFormProps) {
  const [formData, setFormData] = useState({
    name: report?.name || '',
    description: report?.description || '',
    category: report?.category || 'sales',
    type: report?.type || 'table',
    frequency: report?.frequency || 'Mensual',
    status: report?.status || 'active',
    dateRange: report?.dateRange || 'last_month',
    customStartDate: report?.customStartDate || '',
    customEndDate: report?.customEndDate || '',
    metrics: report?.metrics || ['revenue'],
    filters: report?.filters || [],
    groupBy: report?.groupBy || 'date',
    sortBy: report?.sortBy || 'date',
    sortOrder: report?.sortOrder || 'desc'
  });

  const [errors, setErrors] = useState<any>({});

  const categories = [
    { value: 'sales', label: 'Ventas', icon: DollarSign },
    { value: 'clients', label: 'Clientes', icon: Users },
    { value: 'services', label: 'Servicios', icon: Scissors },
    { value: 'products', label: 'Productos', icon: Package },
    { value: 'employees', label: 'Empleados', icon: Users },
    { value: 'financial', label: 'Financiero', icon: BarChart3 }
  ];

  const reportTypes = [
    { value: 'table', label: 'Tabla', icon: FileText },
    { value: 'chart', label: 'Gráfico', icon: PieChart },
    { value: 'mixed', label: 'Mixto', icon: BarChart3 }
  ];

  const frequencies = [
    'Diario',
    'Semanal',
    'Mensual',
    'Trimestral',
    'Anual',
    'Personalizado'
  ];

  const dateRanges = [
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'last_7_days', label: 'Últimos 7 días' },
    { value: 'last_30_days', label: 'Últimos 30 días' },
    { value: 'last_month', label: 'Mes pasado' },
    { value: 'last_quarter', label: 'Trimestre pasado' },
    { value: 'last_year', label: 'Año pasado' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const availableMetrics = {
    sales: [
      { value: 'revenue', label: 'Ingresos' },
      { value: 'transactions', label: 'Transacciones' },
      { value: 'average_sale', label: 'Venta Promedio' },
      { value: 'payment_methods', label: 'Métodos de Pago' }
    ],
    clients: [
      { value: 'new_clients', label: 'Clientes Nuevos' },
      { value: 'returning_clients', label: 'Clientes Recurrentes' },
      { value: 'client_retention', label: 'Retención de Clientes' },
      { value: 'client_lifetime_value', label: 'Valor de Vida del Cliente' }
    ],
    services: [
      { value: 'service_popularity', label: 'Popularidad de Servicios' },
      { value: 'service_revenue', label: 'Ingresos por Servicio' },
      { value: 'service_duration', label: 'Duración Promedio' },
      { value: 'service_satisfaction', label: 'Satisfacción del Cliente' }
    ],
    products: [
      { value: 'product_sales', label: 'Ventas de Productos' },
      { value: 'inventory_turnover', label: 'Rotación de Inventario' },
      { value: 'low_stock_alerts', label: 'Alertas de Stock Bajo' },
      { value: 'supplier_performance', label: 'Rendimiento de Proveedores' }
    ],
    employees: [
      { value: 'employee_productivity', label: 'Productividad' },
      { value: 'employee_revenue', label: 'Ingresos por Empleado' },
      { value: 'employee_schedule', label: 'Horarios de Trabajo' },
      { value: 'employee_performance', label: 'Rendimiento' }
    ],
    financial: [
      { value: 'profit_loss', label: 'Ganancias y Pérdidas' },
      { value: 'cash_flow', label: 'Flujo de Efectivo' },
      { value: 'expenses', label: 'Gastos' },
      { value: 'roi', label: 'Retorno de Inversión' }
    ]
  };

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

  const handleMetricToggle = (metric: string) => {
    setFormData(prev => {
      const metrics = prev.metrics;
      if (metrics.includes(metric)) {
        return { ...prev, metrics: metrics.filter(m => m !== metric) };
      } else {
        return { ...prev, metrics: [...metrics, metric] };
      }
    });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del reporte es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.metrics.length === 0) {
      newErrors.metrics = 'Debe seleccionar al menos una métrica';
    }

    if (formData.dateRange === 'custom') {
      if (!formData.customStartDate) {
        newErrors.customStartDate = 'La fecha de inicio es requerida';
      }
      if (!formData.customEndDate) {
        newErrors.customEndDate = 'La fecha de fin es requerida';
      }
      if (formData.customStartDate && formData.customEndDate && 
          new Date(formData.customEndDate) <= new Date(formData.customStartDate)) {
        newErrors.customEndDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const reportData = {
        ...formData,
        id: report?.id || Date.now(),
        lastGenerated: report?.lastGenerated || new Date().toISOString().split('T')[0],
        createdDate: report?.createdDate || new Date().toISOString().split('T')[0]
      };
      
      onSave(reportData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {report ? 'Editar Reporte' : 'Crear Nuevo Reporte'}
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
                  <label className="block text-sm font-medium mb-2">Nombre del Reporte *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Reporte de Ventas Mensuales"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Frecuencia</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe qué información incluirá este reporte..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Category and Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Categoría y Tipo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(category => (
                      <Card
                        key={category.value}
                        className={`cursor-pointer transition-colors ${
                          formData.category === category.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleInputChange('category', category.value)}
                      >
                        <CardContent className="p-3 text-center">
                          <category.icon className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs font-medium">{category.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Reporte</label>
                  <div className="grid grid-cols-3 gap-2">
                    {reportTypes.map(type => (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-colors ${
                          formData.type === type.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleInputChange('type', type.value)}
                      >
                        <CardContent className="p-3 text-center">
                          <type.icon className="h-5 w-5 mx-auto mb-1" />
                          <p className="text-xs font-medium">{type.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Rango de Fechas</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dateRanges.map(range => (
                  <Card
                    key={range.value}
                    className={`cursor-pointer transition-colors ${
                      formData.dateRange === range.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleInputChange('dateRange', range.value)}
                  >
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium">{range.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {formData.dateRange === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha de Inicio *</label>
                    <Input
                      type="date"
                      value={formData.customStartDate}
                      onChange={(e) => handleInputChange('customStartDate', e.target.value)}
                      className={errors.customStartDate ? 'border-red-500' : ''}
                    />
                    {errors.customStartDate && <p className="text-red-500 text-xs mt-1">{errors.customStartDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha de Fin *</label>
                    <Input
                      type="date"
                      value={formData.customEndDate}
                      onChange={(e) => handleInputChange('customEndDate', e.target.value)}
                      className={errors.customEndDate ? 'border-red-500' : ''}
                    />
                    {errors.customEndDate && <p className="text-red-500 text-xs mt-1">{errors.customEndDate}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Métricas a Incluir</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableMetrics[formData.category]?.map(metric => (
                  <div key={metric.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={metric.value}
                      checked={formData.metrics.includes(metric.value)}
                      onChange={() => handleMetricToggle(metric.value)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor={metric.value} className="text-sm text-gray-700">
                      {metric.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.metrics && <p className="text-red-500 text-sm">{errors.metrics}</p>}
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agrupar por</label>
                  <select
                    value={formData.groupBy}
                    onChange={(e) => handleInputChange('groupBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Fecha</option>
                    <option value="service">Servicio</option>
                    <option value="employee">Empleado</option>
                    <option value="client">Cliente</option>
                    <option value="product">Producto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ordenar por</label>
                  <select
                    value={formData.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Fecha</option>
                    <option value="amount">Cantidad</option>
                    <option value="name">Nombre</option>
                    <option value="count">Conteo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Orden</label>
                  <select
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Descendente</option>
                    <option value="asc">Ascendente</option>
                  </select>
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
                  <option value="inactive">Inactivo</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {report ? 'Actualizar' : 'Crear'} Reporte
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}