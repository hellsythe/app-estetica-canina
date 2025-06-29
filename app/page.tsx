'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Calendar, 
  Scissors, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const stats = [
    {
      title: 'Citas Hoy',
      value: '12',
      icon: Calendar,
      change: '+2',
      changeType: 'positive' as const
    },
    {
      title: 'Ingresos Diarios',
      value: '$2,450',
      icon: DollarSign,
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Clientes Activos',
      value: '284',
      icon: Users,
      change: '+8',
      changeType: 'positive' as const
    },
    {
      title: 'Servicios Completados',
      value: '45',
      icon: Scissors,
      change: '+12%',
      changeType: 'positive' as const
    }
  ];

  const recentAppointments = [
    {
      id: 1,
      client: 'María González',
      pet: 'Max (Golden Retriever)',
      service: 'Baño y Corte Completo',
      time: '10:00 AM',
      status: 'En Proceso'
    },
    {
      id: 2,
      client: 'Carlos Ruiz',
      pet: 'Luna (Poodle)',
      service: 'Corte de Uñas',
      time: '11:30 AM',
      status: 'Pendiente'
    },
    {
      id: 3,
      client: 'Ana Martínez',
      pet: 'Rocky (Pastor Alemán)',
      service: 'Baño Medicinal',
      time: '2:00 PM',
      status: 'Confirmado'
    }
  ];

  const quickActions = [
    {
      title: 'Nueva Cita',
      description: 'Programar nueva cita',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Registrar Cliente',
      description: 'Agregar nuevo cliente',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Venta Rápida',
      description: 'Procesar venta',
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      title: 'Corte de Caja',
      description: 'Cerrar caja del día',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bienvenido de vuelta, aquí tienes el resumen de hoy</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'today' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('today')}
            >
              Hoy
            </Button>
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
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} desde ayer
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Citas de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{appointment.client}</h4>
                      <p className="text-sm text-gray-600">{appointment.pet}</p>
                      <p className="text-sm text-blue-600">{appointment.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Ver Todas las Citas
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                  >
                    <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas de Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Satisfacción del Cliente</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">4.8/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiempo Promedio por Servicio</span>
                  <span className="font-semibold">45 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tasa de Ocupación</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clientes Nuevos (Mes)</span>
                  <span className="font-semibold">23</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Stock Bajo</p>
                    <p className="text-xs text-yellow-600">Champú antipulgas - Solo 2 unidades</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Mensaje Nuevo</p>
                    <p className="text-xs text-blue-600">Cliente pregunta por disponibilidad</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Recordatorio</p>
                    <p className="text-xs text-green-600">Corte de caja pendiente - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}