'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Clock,
  User,
  Scissors,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarDays,
  Trash2
} from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { Appointment } from '@/lib/api/services/appointment/appointment';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 15)); // January 2024
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { appointments, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>(new Appointment());

  // const [appointments, setAppointments] = useState([
  //   {
  //     id: 1,
  //     client: 'María González',
  //     pet: 'Max',
  //     breed: 'Golden Retriever',
  //     service: 'Baño y Corte Completo',
  //     date: '2024-01-15',
  //     time: '10:00 AM',
  //     duration: 90,
  //     price: 45,
  //     status: 'Confirmado',
  //     phone: '+1 (555) 123-4567',
  //     email: 'maria.gonzalez@email.com',
  //     notes: 'Mascota muy tranquila, le gusta el agua tibia'
  //   },
  //   {
  //     id: 2,
  //     client: 'Carlos Ruiz',
  //     pet: 'Luna',
  //     breed: 'Poodle',
  //     service: 'Corte de Uñas',
  //     date: '2024-01-15',
  //     time: '11:30 AM',
  //     duration: 20,
  //     price: 15,
  //     status: 'En Proceso',
  //     phone: '+1 (555) 234-5678',
  //     email: 'carlos.ruiz@email.com',
  //     notes: 'Primera vez, puede estar nerviosa'
  //   },
  //   {
  //     id: 3,
  //     client: 'Ana Martínez',
  //     pet: 'Rocky',
  //     breed: 'Pastor Alemán',
  //     service: 'Baño Medicinal',
  //     date: '2024-01-15',
  //     time: '2:00 PM',
  //     duration: 60,
  //     price: 35,
  //     status: 'Pendiente',
  //     phone: '+1 (555) 345-6789',
  //     email: 'ana.martinez@email.com',
  //     notes: 'Tratamiento para dermatitis'
  //   },
  //   {
  //     id: 4,
  //     client: 'Luis Fernández',
  //     pet: 'Toby',
  //     breed: 'Beagle',
  //     service: 'Baño y Corte Completo',
  //     date: '2024-01-16',
  //     time: '3:30 PM',
  //     duration: 90,
  //     price: 45,
  //     status: 'Confirmado',
  //     phone: '+1 (555) 456-7890',
  //     email: 'luis.fernandez@email.com',
  //     notes: 'Cliente regular'
  //   },
  //   {
  //     id: 5,
  //     client: 'Carmen Silva',
  //     pet: 'Bella',
  //     breed: 'Labrador',
  //     service: 'Corte Estilizado',
  //     date: '2024-01-17',
  //     time: '4:00 PM',
  //     duration: 120,
  //     price: 55,
  //     status: 'Confirmado',
  //     phone: '+1 (555) 567-8901',
  //     email: 'carmen.silva@email.com',
  //     notes: 'Corte especial para competencia'
  //   },
  //   {
  //     id: 6,
  //     client: 'Roberto Díaz',
  //     pet: 'Zeus',
  //     breed: 'Rottweiler',
  //     service: 'Baño Básico',
  //     date: '2024-01-18',
  //     time: '10:00 AM',
  //     duration: 45,
  //     price: 25,
  //     status: 'Pendiente',
  //     phone: '+1 (555) 678-9012',
  //     email: 'roberto.diaz@email.com',
  //     notes: 'Perro grande, necesita espacio'
  //   }
  // ]);

  const filteredAppointments = appointments.filter(appointment =>
    appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAppointment = () => {
    setSelectedAppointment(new Appointment());
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleSaveAppointment = async (appointmentData: Appointment) => {
    if (selectedAppointment.id) {
      // Update existing appointment
      await updateAppointment(selectedAppointment.id, appointmentData);
    } else {
      // Add new appointment
      await createAppointment(appointmentData);
    }
  };

    const handleDeleteAppointment = (id: string) => {
      toast((t) => (
        <div className="flex flex-col gap-4 p-2">
          <p className="font-semibold">¿Estás seguro de que quieres eliminar esta cita?</p>
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
                deleteAppointment(id);
                toast.dismiss(t.id);
                toast.success('Cita eliminada correctamente');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return <CheckCircle className="h-4 w-4" />;
      case 'En Proceso':
        return <Clock className="h-4 w-4" />;
      case 'Completado':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelado':
        return <XCircle className="h-4 w-4" />;
      case 'Pendiente':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(apt => apt.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const calendarDays = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="h-32 border border-gray-200 bg-gray-50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const dayAppointments = getAppointmentsForDate(dateStr);
      const isToday = dateStr === selectedDate;

      calendarDays.push(
        <div
          key={day}
          className={`h-32 border border-gray-200 p-2 overflow-y-auto ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
          } cursor-pointer transition-colors`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className={`font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 3).map((apt) => (
              <div
                key={apt.id}
                className={`text-xs p-1 rounded truncate ${getStatusColor(apt.status)}`}
                title={`${apt.time} - ${apt.client} (${apt.pet})`}
              >
                <div className="font-medium">{apt.time}</div>
                <div className="truncate">{apt.client}</div>
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">
                +{dayAppointments.length - 3} más
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0 mb-4">
            {dayNames.map((dayName) => (
              <div
                key={dayName}
                className="h-10 flex items-center justify-center font-semibold text-gray-700 bg-gray-100 border border-gray-200"
              >
                {dayName}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0">
            {calendarDays}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderListView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Citas del Día - {selectedDate}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAppointments.filter(apt => apt.date === selectedDate).map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-lg">{appointment.time}</span>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(appointment.status)}
                        <span>{appointment.status}</span>
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{appointment.client}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="ml-6">Mascota: {appointment.pet} ({appointment.breed})</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Scissors className="h-4 w-4 mr-2 text-gray-400" />
                        {appointment.service}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {appointment.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {appointment.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Duración:</span> {appointment.duration} min |
                        <span className="font-medium"> Precio:</span> ${appointment.price}
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Notas:</span> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAppointment(appointment.id)}
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
          {filteredAppointments.filter(apt => apt.date === selectedDate).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay citas programadas para esta fecha
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Citas</h1>
            <p className="text-gray-600">Gestiona las citas y horarios de tu estética canina</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddAppointment}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar citas, clientes o mascotas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Hoy</Button>
            <Button variant="outline">Esta Semana</Button>
            <Button variant="outline">Este Mes</Button>
            <Button variant="outline">Todas</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter(apt => apt.date === selectedDate).length}</div>
              <p className="text-xs text-gray-500">Para {selectedDate}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter(apt => apt.status === 'Confirmado').length}</div>
              <p className="text-xs text-gray-500">67% del total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter(apt => apt.status === 'En Proceso').length}</div>
              <p className="text-xs text-gray-500">Luna - Corte de Uñas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
              <Scissors className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${appointments.reduce((sum, apt) => sum + apt.price, 0)}</div>
              <p className="text-xs text-gray-500">{appointments.length} servicios</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              Vista Lista
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Vista Calendario
            </Button>
          </div>
          {viewMode === 'list' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Fecha:</span>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddAppointment}>
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Agendar Cita</h3>
              <p className="text-sm text-gray-600">Crear nueva cita para un cliente</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setViewMode('calendar')}>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Ver Calendario</h3>
              <p className="text-sm text-gray-600">Vista completa del calendario</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-1">Horarios</h3>
              <p className="text-sm text-gray-600">Configurar horarios disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Form Modal */}
        <AppointmentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          appointment={selectedAppointment}
          onSave={handleSaveAppointment}
        />
      </div>
    </DashboardLayout>
  );
}