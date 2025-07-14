'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Heart,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Filter,
  MoreHorizontal,
  Settings,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { usePension } from '@/hooks/usePension';
import { Cage, PensionStay } from '@/lib/api/services/pension/pension';
import PensionStayForm from '@/components/forms/PensionStayForm';
import CheckoutForm from '@/components/forms/CheckoutForm';
import CageForm from '@/components/forms/CageForm';
import toast from 'react-hot-toast';

export default function PensionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cages' | 'stays'>('cages');
  const [isStayFormOpen, setIsStayFormOpen] = useState(false);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [isCageFormOpen, setIsCageFormOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState<PensionStay>(new PensionStay());
  const [selectedCage, setSelectedCage] = useState<Cage>(new Cage());

  const { 
    cages, 
    pensionStays, 
    isLoading, 
    error, 
    syncStatus,
    createCage,
    updateCage,
    deleteCage,
    createPensionStay,
    updatePensionStay,
    checkOutPensionStay,
    deletePensionStay,
    calculateExtraCharges,
    getStayDuration,
    isStayOverdue
  } = usePension();

  // Filter cages based on search term, size and status
  const filteredCages = cages.filter(cage => {
    const matchesSearch = 
      cage.number.toString().includes(searchTerm) ||
      cage.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSize = selectedSize === 'all' || cage.size === selectedSize;
    const matchesStatus = selectedStatus === 'all' || cage.status === selectedStatus;
    
    return matchesSearch && matchesSize && matchesStatus;
  });

  // Filter stays based on search term
  const filteredStays = pensionStays.filter(stay => {
    return (
      stay.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.cage?.number?.toString().includes(searchTerm)
    );
  });

  // Get active stays
  const activeStays = pensionStays.filter(stay => stay.status === 'active');
  
  // Get overdue stays
  const overdueStays = activeStays.filter(stay => isStayOverdue(stay));

  // Get available cages by size
  const getAvailableCagesBySize = (size: string) => {
    return cages.filter(cage => cage.size === size && cage.status === 'available').length;
  };

  // Handle adding a new cage
  const handleAddCage = () => {
    setSelectedCage(new Cage());
    setIsCageFormOpen(true);
  };

  // Handle editing a cage
  const handleEditCage = (cage: Cage) => {
    setSelectedCage(cage);
    setIsCageFormOpen(true);
  };

  // Handle saving a cage
  const handleSaveCage = async (cageData: Cage) => {
    try {
      if (cageData.id) {
        await updateCage(cageData.id, cageData);
        toast.success('Jaula actualizada correctamente');
      } else {
        await createCage(cageData);
        toast.success('Jaula creada correctamente');
      }
    } catch (error) {
      toast.error('Error al guardar la jaula');
    }
  };

  // Handle deleting a cage
  const handleDeleteCage = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-semibold">¿Estás seguro de que quieres eliminar esta jaula?</p>
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
            onClick={async () => {
              try {
                await deleteCage(id);
                toast.dismiss(t.id);
                toast.success('Jaula eliminada correctamente');
              } catch (error) {
                toast.error('Error al eliminar la jaula');
              }
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  // Handle adding a new stay
  const handleAddStay = (cage?: Cage) => {
    const newStay = new PensionStay();
    if (cage) {
      newStay.cageId = cage.id;
      newStay.cage = cage;
    }
    setSelectedStay(newStay);
    setIsStayFormOpen(true);
  };

  // Handle editing a stay
  const handleEditStay = (stay: PensionStay) => {
    setSelectedStay(stay);
    setIsStayFormOpen(true);
  };

  // Handle checkout
  const handleCheckout = (stay: PensionStay) => {
    setSelectedStay(stay);
    setIsCheckoutFormOpen(true);
  };

  // Handle saving a stay
  const handleSaveStay = async (stayData: PensionStay) => {
    try {
      if (stayData.id) {
        await updatePensionStay(stayData.id, stayData);
      } else {
        await createPensionStay(stayData);
      }
    } catch (error) {
      toast.error('Error al guardar la estancia');
    }
  };

  // Handle completing checkout
  const handleCompleteCheckout = async (id: string, checkoutData: any) => {
    try {
      await checkOutPensionStay(id, checkoutData);
      toast.success('Checkout completado correctamente');
    } catch (error) {
      toast.error('Error al completar el checkout');
    }
  };

  // Handle deleting a stay
  const handleDeleteStay = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-semibold">¿Estás seguro de que quieres eliminar esta estancia?</p>
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
            onClick={async () => {
              try {
                await deletePensionStay(id);
                toast.dismiss(t.id);
                toast.success('Estancia eliminada correctamente');
              } catch (error) {
                toast.error('Error al eliminar la estancia');
              }
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  // Get status color for cages
  const getCageStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text for cages
  const getCageStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Ocupada';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return 'Desconocido';
    }
  };

  // Get size text
  const getSizeText = (size: string) => {
    switch (size) {
      case 'small':
        return 'Pequeña';
      case 'medium':
        return 'Mediana';
      case 'large':
        return 'Grande';
      default:
        return 'Desconocido';
    }
  };

  // Get stay status color
  const getStayStatusColor = (stay: PensionStay) => {
    if (stay.status === 'completed') {
      return 'bg-green-100 text-green-800';
    } else if (stay.status === 'cancelled') {
      return 'bg-red-100 text-red-800';
    } else if (isStayOverdue(stay)) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  // Get stay status text
  const getStayStatusText = (stay: PensionStay) => {
    if (stay.status === 'completed') {
      return 'Completada';
    } else if (stay.status === 'cancelled') {
      return 'Cancelada';
    } else if (isStayOverdue(stay)) {
      return 'Vencida';
    } else {
      return 'Activa';
    }
  };

  // Render cage grid
  const renderCageGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCages.map((cage) => (
        <Card key={cage.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  cage.size === 'small' ? 'bg-green-100' :
                  cage.size === 'medium' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <Home className={`h-5 w-5 ${
                    cage.size === 'small' ? 'text-green-600' :
                    cage.size === 'medium' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Jaula #{cage.number}</h3>
                  <p className="text-sm text-gray-600">{cage.location}</p>
                </div>
              </div>
              <Badge className={getCageStatusColor(cage.status)}>
                {getCageStatusText(cage.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tamaño:</span>
                <Badge variant="outline">{getSizeText(cage.size)}</Badge>
              </div>

              {cage.status === 'occupied' && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Ocupada por:</p>
                  {pensionStays.filter(stay => stay.cageId === cage.id && stay.status === 'active').map(stay => (
                    <div key={stay.id} className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        <span>{stay.client?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Heart className="h-3 w-3" />
                        <span>{stay.pet?.name} ({stay.pet?.breed})</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>Desde: {stay.checkInDate}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => handleCheckout(stay)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Checkout
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {cage.notes && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Notas:</span> {cage.notes}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                {cage.status === 'available' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleAddStay(cage)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Registrar
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleEditCage(cage)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleDeleteCage(cage.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add New Cage Card */}
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer border-2 border-dashed border-gray-300 flex items-center justify-center"
        onClick={handleAddCage}
      >
        <CardContent className="p-6 text-center">
          <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold text-gray-700">Agregar Nueva Jaula</h3>
          <p className="text-sm text-gray-500 mt-2">Haz clic para agregar una nueva jaula</p>
        </CardContent>
      </Card>
    </div>
  );

  // Render stays list
  const renderStaysList = () => (
    <div className="space-y-4">
      {filteredStays.map((stay) => (
        <Card key={stay.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {stay.pet?.name} ({stay.pet?.breed})
                  </h3>
                  <Badge className={getStayStatusColor(stay)}>
                    {getStayStatusText(stay)}
                  </Badge>
                  {isStayOverdue(stay) && (
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Recargo
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{stay.client?.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="h-4 w-4 mr-2" />
                      <span>Jaula #{stay.cage?.number} ({getSizeText(stay.cage?.size || '')})</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Ingreso: {stay.checkInDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{stay.checkInTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Salida: {stay.status === 'completed' ? stay.actualCheckOutDate : stay.expectedCheckOutDate}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>Tarifa: ${stay.baseRate}/día</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Duración: {getStayDuration(stay)} días</span>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-green-600">
                        Total: ${(stay.baseRate * getStayDuration(stay) + calculateExtraCharges(stay)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {stay.pendingServices && stay.pendingServices.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-800 mb-1">Servicios Pendientes:</p>
                    <div className="flex flex-wrap gap-2">
                      {stay.pendingServices.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-blue-600 border-blue-300">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stay.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Notas:</span> {stay.notes}
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-2 justify-end">
                {stay.status === 'active' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleCheckout(stay)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Checkout
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditStay(stay)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleDeleteStay(stay.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredStays.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Home className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No hay estancias registradas</h3>
          <p className="text-gray-500 mt-2">Registra una nueva estancia para comenzar</p>
          <Button 
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            onClick={() => handleAddStay()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Registrar Estancia
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pensión Canina</h1>
            <p className="text-gray-600">Gestiona las jaulas y estancias de mascotas</p>
          </div>
          <div className="flex gap-2">
            {viewMode === 'cages' ? (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCage}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Jaula
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAddStay()}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Estancia
              </Button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'cages' ? 'default' : 'outline'}
              onClick={() => setViewMode('cages')}
            >
              <Home className="h-4 w-4 mr-2" />
              Jaulas
            </Button>
            <Button
              variant={viewMode === 'stays' ? 'default' : 'outline'}
              onClick={() => setViewMode('stays')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Estancias
            </Button>
          </div>
          <div className="relative flex-1 max-w-sm ml-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={viewMode === 'cages' ? "Buscar jaulas..." : "Buscar estancias..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jaulas Disponibles</CardTitle>
              <Home className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cages.filter(c => c.status === 'available').length}</div>
              <div className="text-xs text-gray-500 space-y-1 mt-1">
                <div className="flex justify-between">
                  <span>Pequeñas:</span>
                  <span>{getAvailableCagesBySize('small')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medianas:</span>
                  <span>{getAvailableCagesBySize('medium')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grandes:</span>
                  <span>{getAvailableCagesBySize('large')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estancias Activas</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStays.length}</div>
              <p className="text-xs text-gray-500">Mascotas hospedadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estancias Vencidas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueStays.length}</div>
              <p className="text-xs text-gray-500">Requieren atención</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${activeStays.reduce((sum, stay) => {
                  return sum + (stay.baseRate * getStayDuration(stay) + calculateExtraCharges(stay));
                }, 0).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Estancias activas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters for Cages */}
        {viewMode === 'cages' && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSize === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSize('all')}
            >
              Todas
            </Button>
            <Button
              variant={selectedSize === 'small' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSize('small')}
            >
              Pequeñas
            </Button>
            <Button
              variant={selectedSize === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSize('medium')}
            >
              Medianas
            </Button>
            <Button
              variant={selectedSize === 'large' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSize('large')}
            >
              Grandes
            </Button>
            <div className="border-l border-gray-300 mx-2"></div>
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('all')}
            >
              Todos los estados
            </Button>
            <Button
              variant={selectedStatus === 'available' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('available')}
            >
              Disponibles
            </Button>
            <Button
              variant={selectedStatus === 'occupied' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('occupied')}
            >
              Ocupadas
            </Button>
            <Button
              variant={selectedStatus === 'maintenance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('maintenance')}
            >
              Mantenimiento
            </Button>
          </div>
        )}

        {/* Main Content */}
        {viewMode === 'cages' ? renderCageGrid() : renderStaysList()}

        {/* Forms */}
        <PensionStayForm
          isOpen={isStayFormOpen}
          onClose={() => setIsStayFormOpen(false)}
          pensionStay={selectedStay}
          availableCages={cages.filter(cage => cage.status === 'available' || cage.id === selectedStay.cageId)}
          onSave={handleSaveStay}
        />

        <CheckoutForm
          isOpen={isCheckoutFormOpen}
          onClose={() => setIsCheckoutFormOpen(false)}
          pensionStay={selectedStay}
          onCheckout={handleCompleteCheckout}
          calculateExtraCharges={calculateExtraCharges}
          getStayDuration={getStayDuration}
        />

        <CageForm
          isOpen={isCageFormOpen}
          onClose={() => setIsCageFormOpen(false)}
          cage={selectedCage}
          onSave={handleSaveCage}
        />
      </div>
    </DashboardLayout>
  );
}