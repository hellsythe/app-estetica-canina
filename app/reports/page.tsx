'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportForm from '@/components/forms/ReportForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Download,
  Calendar,
  DollarSign,
  Users,
  Scissors,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  FileText,
  PieChart,
  LineChart,
  Activity,
  Target,
  Clock,
  Star,
  Package,
  MessageSquare,
  CreditCard,
  Banknote,
  ShoppingCart,
  Ticket,
  Edit,
  Trash2
} from 'lucide-react';

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const reportCategories = [
    { id: 'sales', name: 'Ventas', icon: DollarSign, color: 'bg-green-500' },
    { id: 'clients', name: 'Clientes', icon: Users, color: 'bg-blue-500' },
    { id: 'services', name: 'Servicios', icon: Scissors, color: 'bg-purple-500' },
    { id: 'products', name: 'Productos', icon: Package, color: 'bg-orange-500' },
    { id: 'employees', name: 'Empleados', icon: Users, color: 'bg-indigo-500' },
    { id: 'financial', name: 'Financiero', icon: BarChart3, color: 'bg-red-500' }
  ];

  const [availableReports, setAvailableReports] = useState([
    {
      id: 1,
      name: 'Reporte de Ventas Diarias',
      description: 'Análisis detallado de ventas por día, servicios más vendidos y métodos de pago',
      category: 'sales',
      type: 'table',
      lastGenerated: '2024-01-15',
      frequency: 'Diario',
      status: 'active'
    },
    {
      id: 2,
      name: 'Análisis de Clientes',
      description: 'Segmentación de clientes, frecuencia de visitas y valor de vida del cliente',
      category: 'clients',
      type: 'chart',
      lastGenerated: '2024-01-14',
      frequency: 'Semanal',
      status: 'active'
    },
    {
      id: 3,
      name: 'Rendimiento de Servicios',
      description: 'Popularidad de servicios, tiempo promedio y rentabilidad por servicio',
      category: 'services',
      type: 'mixed',
      lastGenerated: '2024-01-13',
      frequency: 'Mensual',
      status: 'active'
    },
    {
      id: 4,
      name: 'Inventario y Productos',
      description: 'Rotación de inventario, productos más vendidos y análisis de stock',
      category: 'products',
      type: 'table',
      lastGenerated: '2024-01-12',
      frequency: 'Semanal',
      status: 'active'
    },
    {
      id: 5,
      name: 'Productividad de Empleados',
      description: 'Servicios realizados por empleado, tiempo promedio y satisfacción del cliente',
      category: 'employees',
      type: 'chart',
      lastGenerated: '2024-01-11',
      frequency: 'Mensual',
      status: 'active'
    },
    {
      id: 6,
      name: 'Estado Financiero',
      description: 'Ingresos, gastos, márgenes de ganancia y flujo de efectivo',
      category: 'financial',
      type: 'mixed',
      lastGenerated: '2024-01-10',
      frequency: 'Mensual',
      status: 'active'
    }
  ]);

  const keyMetrics = [
    {
      title: 'Ingresos del Mes',
      value: '$12,450',
      change: '+15.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Clientes Atendidos',
      value: '284',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Servicios Realizados',
      value: '456',
      change: '+12.1%',
      changeType: 'positive',
      icon: Scissors,
      color: 'text-purple-600'
    },
    {
      title: 'Satisfacción Cliente',
      value: '4.8/5',
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const salesData = [
    { period: 'Ene', ventas: 8500, servicios: 145, productos: 89 },
    { period: 'Feb', ventas: 9200, servicios: 156, productos: 92 },
    { period: 'Mar', ventas: 10100, servicios: 167, productos: 98 },
    { period: 'Abr', ventas: 11300, servicios: 178, productos: 105 },
    { period: 'May', ventas: 12450, servicios: 189, productos: 112 }
  ];

  const topServices = [
    { name: 'Baño y Corte Completo', count: 89, revenue: 4005, percentage: 32 },
    { name: 'Baño Básico', count: 67, revenue: 1675, percentage: 24 },
    { name: 'Corte Estilizado', count: 45, revenue: 2475, percentage: 16 },
    { name: 'Spa Canino', count: 23, revenue: 1955, percentage: 8 },
    { name: 'Tratamiento Antipulgas', count: 34, revenue: 1190, percentage: 12 }
  ];

  const clientSegments = [
    { segment: 'Clientes VIP', count: 32, percentage: 11, revenue: 4200 },
    { segment: 'Clientes Frecuentes', count: 89, percentage: 31, revenue: 6800 },
    { segment: 'Clientes Regulares', count: 124, percentage: 44, revenue: 3200 },
    { segment: 'Clientes Nuevos', count: 39, percentage: 14, revenue: 1250 }
  ];

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && report.category === selectedCategory;
  });

  const handleAddReport = () => {
    setSelectedReport(null);
    setIsFormOpen(true);
  };

  const handleEditReport = (report: any) => {
    setSelectedReport(report);
    setIsFormOpen(true);
  };

  const handleSaveReport = (reportData: any) => {
    if (selectedReport) {
      // Update existing report
      setAvailableReports(prev => prev.map(report => 
        report.id === reportData.id ? reportData : report
      ));
    } else {
      // Add new report
      setAvailableReports(prev => [...prev, reportData]);
    }
  };

  const handleDeleteReport = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      setAvailableReports(prev => prev.filter(report => report.id !== id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'table':
        return <FileText className="h-4 w-4" />;
      case 'chart':
        return <PieChart className="h-4 w-4" />;
      case 'mixed':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const generateReport = (reportId: number) => {
    console.log('Generating report:', reportId);
    // Aquí implementarías la lógica para generar el reporte
  };

  const exportReport = (reportId: number, format: string) => {
    console.log('Exporting report:', reportId, 'as', format);
    // Aquí implementarías la lógica para exportar el reporte
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
            <p className="text-gray-600">Análisis completo del rendimiento de tu negocio</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todo
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddReport}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Reporte
            </Button>
          </div>
        </div>

        {/* Period and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <Button 
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('week')}
            >
              Esta Semana
            </Button>
            <Button 
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('month')}
            >
              Este Mes
            </Button>
            <Button 
              variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('quarter')}
            >
              Trimestre
            </Button>
            <Button 
              variant={selectedPeriod === 'year' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('year')}
            >
              Año
            </Button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs flex items-center ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change} vs mes anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Tendencia de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.period}</span>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold">${data.ventas.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{data.servicios + data.productos} servicios</p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(data.ventas / 15000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Servicios Más Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{service.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${service.revenue}</p>
                        <p className="text-xs text-gray-500">{service.count} servicios</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${service.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Segmentación de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {clientSegments.map((segment, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{segment.segment}</h3>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-blue-600">{segment.count}</p>
                    <p className="text-sm text-gray-600">{segment.percentage}% del total</p>
                    <p className="text-sm font-medium text-green-600">${segment.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías de Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <div className="p-2 rounded-lg bg-gray-500">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm">Todos</span>
              </Button>
              {reportCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm">{category.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(report.type)}
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <Badge variant="outline">{report.frequency}</Badge>
                        <Badge variant={report.status === 'active' ? 'default' : 'secondary'}>
                          {report.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Último: {report.lastGenerated}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {report.frequency}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateReport(report.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportReport(report.id, 'pdf')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportReport(report.id, 'excel')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditReport(report)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm">Efectivo</span>
                  </div>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm">Tarjeta</span>
                  </div>
                  <span className="font-semibold">35%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios Pico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">10:00 - 12:00</span>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">14:00 - 16:00</span>
                  <span className="font-semibold">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">16:00 - 18:00</span>
                  <span className="font-semibold">22%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Ventas</span>
                    <span className="text-sm font-semibold">83%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Clientes Nuevos</span>
                    <span className="text-sm font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Form Modal */}
        <ReportForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          report={selectedReport}
          onSave={handleSaveReport}
        />
      </div>
    </DashboardLayout>
  );
}