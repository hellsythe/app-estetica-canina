'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Save,
  Megaphone,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Calendar,
  Target,
  Send
} from 'lucide-react';

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: any;
  onSave: (campaign: any) => void;
}

export default function CampaignForm({ isOpen, onClose, campaign, onSave }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    type: campaign?.type || 'reactivation',
    channel: campaign?.channel || 'email',
    audience: campaign?.audience || 'all',
    startDate: campaign?.startDate || new Date().toISOString().split('T')[0],
    endDate: campaign?.endDate || '',
    subject: campaign?.subject || '',
    message: campaign?.message || '',
    status: campaign?.status || 'draft',
    budget: campaign?.budget || '',
    targetMetric: campaign?.targetMetric || 'clicks',
    targetValue: campaign?.targetValue || ''
  });

  const [errors, setErrors] = useState<any>({});

  const campaignTypes = [
    { value: 'reactivation', label: 'Reactivación de Clientes' },
    { value: 'promotion', label: 'Promoción Especial' },
    { value: 'welcome', label: 'Bienvenida' },
    { value: 'reminder', label: 'Recordatorio' },
    { value: 'loyalty', label: 'Programa de Lealtad' },
    { value: 'seasonal', label: 'Campaña Estacional' }
  ];

  const channels = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { value: 'sms', label: 'SMS', icon: Phone },
    { value: 'social', label: 'Redes Sociales', icon: Users }
  ];

  const audiences = [
    { value: 'all', label: 'Todos los Clientes' },
    { value: 'vip', label: 'Clientes VIP' },
    { value: 'frequent', label: 'Clientes Frecuentes' },
    { value: 'inactive', label: 'Clientes Inactivos (3+ meses)' },
    { value: 'new', label: 'Clientes Nuevos (últimos 30 días)' },
    { value: 'birthday', label: 'Cumpleaños de Mascotas' }
  ];

  const messageTemplates = {
    reactivation: '¡Te extrañamos! Vuelve y obtén un 25% de descuento en tu próxima visita. Tu mascota merece el mejor cuidado.',
    promotion: '¡Oferta especial! Aprovecha nuestros descuentos por tiempo limitado. ¡No te lo pierdas!',
    welcome: '¡Bienvenido a PetStyle! Estamos emocionados de cuidar a tu mascota. Obtén 20% de descuento en tu primera visita.',
    reminder: 'Recordatorio: Tu mascota necesita su cita de mantenimiento. ¡Agenda ahora y mantén a tu peludo feliz!',
    loyalty: '¡Gracias por tu lealtad! Como cliente especial, tienes beneficios exclusivos esperándote.',
    seasonal: '¡Prepara a tu mascota para la temporada! Servicios especiales con descuentos únicos.'
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

  const handleTemplateSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      message: messageTemplates[type] || ''
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la campaña es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    }

    if (formData.channel === 'email' && !formData.subject.trim()) {
      newErrors.subject = 'El asunto del email es requerido';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de finalización es requerida';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'La fecha de finalización debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const campaignData = {
        ...formData,
        id: campaign?.id || Date.now(),
        sent: campaign?.sent || 0,
        opened: campaign?.opened || 0,
        clicked: campaign?.clicked || 0,
        converted: campaign?.converted || 0,
        revenue: campaign?.revenue || 0,
        createdDate: campaign?.createdDate || new Date().toISOString().split('T')[0]
      };
      
      onSave(campaignData);
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
              <Megaphone className="h-5 w-5" />
              {campaign ? 'Editar Campaña' : 'Nueva Campaña de Marketing'}
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
                  <label className="block text-sm font-medium mb-2">Nombre de la Campaña *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Campaña de Reactivación - Enero 2024"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Campaña</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {campaignTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe el objetivo y estrategia de la campaña..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Channel and Audience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Canal y Audiencia</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Canal de Comunicación</label>
                  <div className="grid grid-cols-2 gap-2">
                    {channels.map(channel => (
                      <Card
                        key={channel.value}
                        className={`cursor-pointer transition-colors ${
                          formData.channel === channel.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleInputChange('channel', channel.value)}
                      >
                        <CardContent className="p-3 text-center">
                          <channel.icon className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-sm font-medium">{channel.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Audiencia Objetivo</label>
                  <select
                    value={formData.audience}
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {audiences.map(audience => (
                      <option key={audience.value} value={audience.value}>{audience.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contenido del Mensaje</h3>
              
              {formData.channel === 'email' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Asunto del Email *</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Ej: ¡Te extrañamos! Vuelve con un 25% de descuento"
                    className={errors.subject ? 'border-red-500' : ''}
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Mensaje *</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateSelect(formData.type)}
                  >
                    Usar Plantilla
                  </Button>
                </div>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Escribe el mensaje de tu campaña..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={5}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
            </div>

            {/* Schedule and Budget */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Programación y Presupuesto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Inicio *</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Finalización *</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Presupuesto ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="100.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Borrador</option>
                    <option value="scheduled">Programada</option>
                    <option value="active">Activa</option>
                    <option value="paused">Pausada</option>
                    <option value="completed">Completada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Objetivos de la Campaña</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Métrica Principal</label>
                  <select
                    value={formData.targetMetric}
                    onChange={(e) => handleInputChange('targetMetric', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="clicks">Clics</option>
                    <option value="opens">Aperturas</option>
                    <option value="conversions">Conversiones</option>
                    <option value="revenue">Ingresos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Objetivo Numérico</label>
                  <Input
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => handleInputChange('targetValue', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {campaign ? 'Actualizar' : 'Crear'} Campaña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}