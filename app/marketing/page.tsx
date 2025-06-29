'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CampaignForm from '@/components/forms/CampaignForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Megaphone, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Send,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  MessageSquare,
  Gift,
  CreditCard,
  Star,
  Clock,
  DollarSign,
  Eye,
  Heart,
  UserCheck,
  AlertCircle,
  Filter,
  Download,
  Play,
  Pause,
  Copy,
  Trash2,
  Lightbulb,
  Zap,
  Award,
  Wallet,
  Percent,
  ShoppingBag,
  Phone,
  MapPin
} from 'lucide-react';

export default function MarketingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('campaigns');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Campaña de Reactivación - Clientes Inactivos',
      type: 'reactivation',
      status: 'active',
      channel: 'email',
      audience: 'Clientes sin visitas en 3+ meses',
      sent: 156,
      opened: 89,
      clicked: 23,
      converted: 8,
      revenue: 420,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      description: 'Oferta especial del 25% para clientes que no han visitado en los últimos 3 meses'
    },
    {
      id: 2,
      name: 'Promoción Fin de Semana',
      type: 'promotion',
      status: 'scheduled',
      channel: 'whatsapp',
      audience: 'Clientes VIP y Frecuentes',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      startDate: '2024-01-20',
      endDate: '2024-01-21',
      description: 'Descuento del 15% en servicios premium para fin de semana'
    },
    {
      id: 3,
      name: 'Bienvenida Nuevos Clientes',
      type: 'welcome',
      status: 'active',
      channel: 'email',
      audience: 'Clientes registrados últimos 7 días',
      sent: 45,
      opened: 38,
      clicked: 15,
      converted: 12,
      revenue: 540,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Serie de bienvenida con cupón del 20% para primera visita'
    },
    {
      id: 4,
      name: 'Recordatorio Citas Perdidas',
      type: 'reminder',
      status: 'paused',
      channel: 'sms',
      audience: 'Clientes con citas canceladas',
      sent: 78,
      opened: 78,
      clicked: 34,
      converted: 18,
      revenue: 810,
      startDate: '2024-01-05',
      endDate: '2024-03-05',
      description: 'Recordatorio automático con oferta especial para reagendar'
    }
  ]);

  const inactiveClients = [
    {
      id: 1,
      name: 'Patricia López',
      email: 'patricia.lopez@email.com',
      phone: '+1 (555) 123-4567',
      lastVisit: '2023-09-15',
      daysSinceVisit: 127,
      totalSpent: 340,
      averageSpent: 45,
      pet: 'Milo (Schnauzer)',
      preferredService: 'Baño y Corte Completo',
      riskLevel: 'high'
    },
    {
      id: 2,
      name: 'Roberto Martínez',
      email: 'roberto.martinez@email.com',
      phone: '+1 (555) 234-5678',
      lastVisit: '2023-10-22',
      daysSinceVisit: 90,
      totalSpent: 180,
      averageSpent: 30,
      pet: 'Kira (Border Collie)',
      preferredService: 'Baño Básico',
      riskLevel: 'medium'
    },
    {
      id: 3,
      name: 'Elena Rodríguez',
      email: 'elena.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      lastVisit: '2023-11-08',
      daysSinceVisit: 68,
      totalSpent: 520,
      averageSpent: 65,
      pet: 'Thor (Pastor Alemán)',
      preferredService: 'Spa Canino',
      riskLevel: 'medium'
    }
  ];

  const loyaltyPrograms = [
    {
      id: 1,
      name: 'Tarjeta Cliente Frecuente',
      type: 'points',
      description: 'Acumula 1 punto por cada $10 gastados. 100 puntos = $10 de descuento',
      members: 156,
      pointsIssued: 12450,
      pointsRedeemed: 8900,
      status: 'active'
    },
    {
      id: 2,
      name: 'Monedero Digital',
      type: 'wallet',
      description: 'Recarga tu monedero y obtén 10% extra en cada recarga de $100+',
      members: 89,
      totalBalance: 4560,
      totalRecharges: 15600,
      status: 'active'
    },
    {
      id: 3,
      name: 'Club VIP',
      type: 'tier',
      description: 'Acceso exclusivo a servicios premium y descuentos especiales',
      members: 32,
      benefits: ['15% descuento permanente', 'Prioridad en citas', 'Servicios exclusivos'],
      status: 'active'
    }
  ];

  const marketingStrategies = [
    {
      id: 1,
      title: 'Campaña de Referidos',
      description: 'Incentiva a clientes actuales a referir nuevos clientes',
      impact: 'Alto',
      effort: 'Medio',
      roi: '300%',
      timeline: '2-4 semanas',
      tactics: ['Descuento para referidor', 'Descuento para referido', 'Seguimiento automático']
    },
    {
      id: 2,
      title: 'Marketing Estacional',
      description: 'Promociones específicas para temporadas y fechas especiales',
      impact: 'Alto',
      effort: 'Bajo',
      roi: '250%',
      timeline: '1-2 semanas',
      tactics: ['Ofertas de temporada', 'Contenido temático', 'Promociones flash']
    },
    {
      id: 3,
      title: 'Programa de Reactivación',
      description: 'Recupera clientes que no han visitado recientemente',
      impact: 'Medio',
      effort: 'Medio',
      roi: '180%',
      timeline: '3-6 semanas',
      tactics: ['Email personalizado', 'Ofertas especiales', 'Llamadas de seguimiento']
    },
    {
      id: 4,
      title: 'Marketing de Contenido',
      description: 'Crea contenido valioso para educar y atraer clientes',
      impact: 'Medio',
      effort: 'Alto',
      roi: '200%',
      timeline: '2-3 meses',
      tactics: ['Blog de cuidado canino', 'Videos tutoriales', 'Redes sociales']
    }
  ];

  const clientSegments = [
    {
      id: 'vip',
      name: 'Clientes VIP',
      count: 32,
      criteria: 'Gasto > $500 últimos 6 meses',
      avgSpent: 125,
      frequency: 'Quincenal',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'frequent',
      name: 'Clientes Frecuentes',
      count: 89,
      criteria: '4+ visitas últimos 3 meses',
      avgSpent: 65,
      frequency: 'Mensual',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'regular',
      name: 'Clientes Regulares',
      count: 124,
      criteria: '2-3 visitas últimos 3 meses',
      avgSpent: 45,
      frequency: 'Bimensual',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'new',
      name: 'Clientes Nuevos',
      count: 39,
      criteria: 'Primera visita últimos 30 días',
      avgSpent: 35,
      frequency: 'Primera vez',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'inactive',
      name: 'Clientes Inactivos',
      count: 67,
      criteria: 'Sin visitas últimos 3+ meses',
      avgSpent: 0,
      frequency: 'Ninguna',
      color: 'bg-red-100 text-red-800'
    }
  ];

  const tabs = [
    { id: 'campaigns', name: 'Campañas', icon: Megaphone },
    { id: 'inactive', name: 'Clientes Inactivos', icon: UserCheck },
    { id: 'loyalty', name: 'Programas de Lealtad', icon: Award },
    { id: 'strategies', name: 'Estrategias', icon: Lightbulb },
    { id: 'segments', name: 'Segmentación', icon: Target }
  ];

  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    setIsFormOpen(true);
  };

  const handleEditCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleSaveCampaign = (campaignData: any) => {
    if (selectedCampaign) {
      // Update existing campaign
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignData.id ? campaignData : campaign
      ));
    } else {
      // Add new campaign
      setCampaigns(prev => [...prev, campaignData]);
    }
  };

  const handleDeleteCampaign = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta campaña?')) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'sms':
        return <Phone className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Alto':
        return 'text-green-600';
      case 'Medio':
        return 'text-yellow-600';
      case 'Bajo':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campañas Activas</CardTitle>
            <Megaphone className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-gray-500">{campaigns.filter(c => c.status === 'scheduled').length} programadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
            <Eye className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-gray-500">+12% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.reduce((sum, c) => sum + c.converted, 0)}</div>
            <p className="text-xs text-gray-500">15% tasa conversión</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Generados</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaigns.reduce((sum, c) => sum + c.revenue, 0)}</div>
            <p className="text-xs text-gray-500">ROI: 285%</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campañas de Marketing</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCampaign}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status === 'active' ? 'Activa' : 
                         campaign.status === 'scheduled' ? 'Programada' : 
                         campaign.status === 'paused' ? 'Pausada' : 'Completada'}
                      </Badge>
                      <div className="flex items-center text-gray-500">
                        {getChannelIcon(campaign.channel)}
                        <span className="ml-1 text-sm capitalize">{campaign.channel}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Audiencia:</span> {campaign.audience}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Período:</span> {campaign.startDate} - {campaign.endDate}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{campaign.sent}</div>
                          <div className="text-xs text-gray-500">Enviados</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{campaign.opened}</div>
                          <div className="text-xs text-gray-500">Abiertos</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{campaign.clicked}</div>
                          <div className="text-xs text-gray-500">Clics</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">{campaign.converted}</div>
                          <div className="text-xs text-gray-500">Conversiones</div>
                        </div>
                      </div>
                    </div>
                    
                    {campaign.revenue > 0 && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">Ingresos Generados:</span>
                          <span className="text-lg font-bold text-green-600">${campaign.revenue}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {campaign.status === 'active' && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {campaign.status === 'paused' && (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCampaign(campaign.id)}
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
    </div>
  );

  const renderInactiveTab = () => (
    <div className="space-y-6">
      {/* Inactive Clients Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Inactivos</CardTitle>
            <UserCheck className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-gray-500">19% del total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riesgo Alto</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-gray-500">120+ días sin visita</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Perdido</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,240</div>
            <p className="text-xs text-gray-500">Ingresos potenciales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Reactivación</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-gray-500">Últimas campañas</p>
          </CardContent>
        </Card>
      </div>

      {/* Inactive Clients List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Clientes que Requieren Atención</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Send className="h-4 w-4 mr-2" />
                Campaña de Reactivación
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inactiveClients.map((client) => (
              <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <Badge className={getRiskLevelColor(client.riskLevel)}>
                        {client.riskLevel === 'high' ? 'Riesgo Alto' : 
                         client.riskLevel === 'medium' ? 'Riesgo Medio' : 'Riesgo Bajo'}
                      </Badge>
                      <span className="text-sm text-gray-500">{client.daysSinceVisit} días sin visita</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {client.phone}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Mascota:</span> {client.pet}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Última visita:</span> {client.lastVisit}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Servicio preferido:</span> {client.preferredService}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Total gastado:</span> 
                          <span className="text-green-600 font-semibold"> ${client.totalSpent}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Promedio por visita:</span> ${client.averageSpent}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Llamar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLoyaltyTab = () => (
    <div className="space-y-6">
      {/* Loyalty Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
            <Award className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">277</div>
            <p className="text-xs text-gray-500">78% de clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos Activos</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,550</div>
            <p className="text-xs text-gray-500">$355 en descuentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monederos Activos</CardTitle>
            <Wallet className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,560</div>
            <p className="text-xs text-gray-500">Saldo total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retención</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-gray-500">Clientes leales</p>
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loyaltyPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {program.type === 'points' && <Star className="h-5 w-5 text-yellow-500" />}
                  {program.type === 'wallet' && <Wallet className="h-5 w-5 text-green-500" />}
                  {program.type === 'tier' && <Award className="h-5 w-5 text-purple-500" />}
                  {program.name}
                </CardTitle>
                <Badge className={getStatusColor(program.status)}>
                  {program.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{program.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Miembros:</span>
                  <span className="text-lg font-bold text-blue-600">{program.members}</span>
                </div>
                
                {program.type === 'points' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Puntos emitidos:</span>
                      <span className="font-semibold">{program.pointsIssued?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Puntos canjeados:</span>
                      <span className="font-semibold">{program.pointsRedeemed?.toLocaleString()}</span>
                    </div>
                  </>
                )}
                
                {program.type === 'wallet' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Saldo total:</span>
                      <span className="font-semibold text-green-600">${program.totalBalance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total recargado:</span>
                      <span className="font-semibold">${program.totalRecharges}</span>
                    </div>
                  </>
                )}
                
                {program.type === 'tier' && program.benefits && (
                  <div>
                    <span className="text-sm font-medium">Beneficios:</span>
                    <ul className="mt-1 space-y-1">
                      {program.benefits.map((benefit, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Miembros
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Plus className="h-6 w-6 text-blue-600" />
              <span className="font-medium">Crear Programa</span>
              <span className="text-xs text-gray-500">Nuevo programa de lealtad</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Gift className="h-6 w-6 text-green-600" />
              <span className="font-medium">Promoción Especial</span>
              <span className="text-xs text-gray-500">Bonificación de puntos</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Download className="h-6 w-6 text-purple-600" />
              <span className="font-medium">Exportar Datos</span>
              <span className="text-xs text-gray-500">Reporte de miembros</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStrategiesTab = () => (
    <div className="space-y-6">
      {/* Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {marketingStrategies.map((strategy) => (
          <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  {strategy.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">ROI: {strategy.roi}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-gray-500">Impacto</span>
                  <div className={`font-semibold ${getImpactColor(strategy.impact)}`}>
                    {strategy.impact}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Esfuerzo</span>
                  <div className={`font-semibold ${getImpactColor(strategy.effort)}`}>
                    {strategy.effort}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">ROI Esperado</span>
                  <div className="font-semibold text-green-600">{strategy.roi}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Tiempo</span>
                  <div className="font-semibold text-blue-600">{strategy.timeline}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Tácticas Recomendadas:</span>
                <ul className="mt-2 space-y-1">
                  {strategy.tactics.map((tactic, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <Zap className="h-3 w-3 text-yellow-500 mr-2" />
                      {tactic}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Play className="h-4 w-4 mr-1" />
                  Implementar
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Marketing Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Consejos de Marketing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Personalización</h4>
              <p className="text-sm text-blue-700">
                Usa el nombre de la mascota en tus comunicaciones. Los dueños se sienten más conectados cuando mencionas a su compañero peludo.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Timing Perfecto</h4>
              <p className="text-sm text-green-700">
                Envía recordatorios 2-3 semanas después del último servicio. Es el momento ideal para la siguiente cita.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Contenido Visual</h4>
              <p className="text-sm text-purple-700">
                Las fotos antes/después tienen 3x más engagement. Siempre pide permiso para usar las fotos de las mascotas.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Estacionalidad</h4>
              <p className="text-sm text-orange-700">
                Adapta tus servicios a las estaciones: baños refrescantes en verano, cuidado especial en invierno.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSegmentsTab = () => (
    <div className="space-y-6">
      {/* Segmentation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Segmentación de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {clientSegments.map((segment) => (
              <div
                key={segment.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSegment(segment.id)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{segment.count}</div>
                  <Badge className={segment.color} variant="secondary">
                    {segment.name}
                  </Badge>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-600">{segment.criteria}</div>
                    <div className="text-xs font-medium">Promedio: ${segment.avgSpent}</div>
                    <div className="text-xs text-gray-500">{segment.frequency}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Segment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientSegments.map((segment) => (
                <div key={segment.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${segment.color.replace('text-', 'bg-').replace('100', '500')}`}></div>
                    <span className="text-sm font-medium">{segment.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{segment.count}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round((segment.count / clientSegments.reduce((sum, s) => sum + s.count, 0)) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor por Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientSegments.map((segment) => (
                <div key={segment.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{segment.name}</span>
                    <span className="text-sm font-bold">${segment.avgSpent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${segment.color.replace('text-', 'bg-').replace('100', '500')}`}
                      style={{ width: `${(segment.avgSpent / 125) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones por Segmento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="font-medium">Campaña VIP</span>
              <span className="text-xs text-gray-500">Ofertas exclusivas para clientes VIP</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="font-medium">Reactivar Inactivos</span>
              <span className="text-xs text-gray-500">Campaña de reconquista</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Gift className="h-6 w-6 text-green-600" />
              <span className="font-medium">Bienvenida Nuevos</span>
              <span className="text-xs text-gray-500">Serie de onboarding</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns':
        return renderCampaignsTab();
      case 'inactive':
        return renderInactiveTab();
      case 'loyalty':
        return renderLoyaltyTab();
      case 'strategies':
        return renderStrategiesTab();
      case 'segments':
        return renderSegmentsTab();
      default:
        return renderCampaignsTab();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
            <p className="text-gray-600">Estrategias para atraer, retener y hacer crecer tu base de clientes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Datos
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCampaign}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar campañas, clientes o estrategias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Campaign Form Modal */}
        <CampaignForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          campaign={selectedCampaign}
          onSave={handleSaveCampaign}
        />
      </div>
    </DashboardLayout>
  );
}