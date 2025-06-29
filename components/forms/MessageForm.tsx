'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Save,
  MessageSquare,
  Search,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface MessageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (conversation: any) => void;
}

export default function MessageForm({ isOpen, onClose, onSave }: MessageFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState<any>({});

  // Mock clients data - in real app, this would come from your database
  const clients = [
    { 
      id: 1, 
      name: 'María González', 
      phone: '+1 (555) 123-4567', 
      email: 'maria.gonzalez@email.com',
      avatar: 'MG'
    },
    { 
      id: 2, 
      name: 'Carlos Ruiz', 
      phone: '+1 (555) 234-5678', 
      email: 'carlos.ruiz@email.com',
      avatar: 'CR'
    },
    { 
      id: 3, 
      name: 'Ana Martínez', 
      phone: '+1 (555) 345-6789', 
      email: 'ana.martinez@email.com',
      avatar: 'AM'
    },
    { 
      id: 4, 
      name: 'Luis Fernández', 
      phone: '+1 (555) 456-7890', 
      email: 'luis.fernandez@email.com',
      avatar: 'LF'
    },
    { 
      id: 5, 
      name: 'Carmen Silva', 
      phone: '+1 (555) 567-8901', 
      email: 'carmen.silva@email.com',
      avatar: 'CS'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setIsNewClient(false);
  };

  const handleNewClientChange = (field: string, value: string) => {
    setNewClientData(prev => ({
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

  const validateForm = () => {
    const newErrors: any = {};

    if (!isNewClient && !selectedClient) {
      newErrors.client = 'Debe seleccionar un cliente';
    }

    if (isNewClient) {
      if (!newClientData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      }
      if (!newClientData.phone.trim()) {
        newErrors.phone = 'El teléfono es requerido';
      }
    }

    if (!message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      let clientInfo;
      
      if (isNewClient) {
        clientInfo = {
          id: Date.now(),
          name: newClientData.name,
          phone: newClientData.phone,
          email: newClientData.email,
          avatar: newClientData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        };
      } else {
        clientInfo = selectedClient;
      }

      const conversationData = {
        id: Date.now(),
        client: clientInfo.name,
        lastMessage: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        status: 'online',
        avatar: clientInfo.avatar,
        clientInfo: clientInfo,
        messages: [
          {
            id: 1,
            sender: 'admin',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
          }
        ]
      };
      
      onSave(conversationData);
      onClose();
      
      // Reset form
      setSelectedClient(null);
      setMessage('');
      setIsNewClient(false);
      setNewClientData({ name: '', phone: '', email: '' });
      setSearchTerm('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Nueva Conversación
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Seleccionar Cliente</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewClient(!isNewClient)}
                >
                  {isNewClient ? 'Seleccionar Existente' : 'Cliente Nuevo'}
                </Button>
              </div>

              {!isNewClient ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar cliente por nombre, teléfono o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredClients.map(client => (
                      <Card
                        key={client.id}
                        className={`cursor-pointer transition-colors ${
                          selectedClient?.id === client.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleClientSelect(client)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {client.avatar}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{client.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {client.phone}
                                </span>
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {client.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {errors.client && <p className="text-red-500 text-sm">{errors.client}</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <Input
                      value={newClientData.name}
                      onChange={(e) => handleNewClientChange('name', e.target.value)}
                      placeholder="Nombre del cliente"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono *</label>
                    <Input
                      value={newClientData.phone}
                      onChange={(e) => handleNewClientChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={newClientData.email}
                      onChange={(e) => handleNewClientChange('email', e.target.value)}
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Mensaje Inicial</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mensaje *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje inicial..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={4}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Quick Message Templates */}
              <div>
                <label className="block text-sm font-medium mb-2">Plantillas Rápidas</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage('¡Hola! ¿Cómo podemos ayudarte hoy?')}
                    className="text-left justify-start"
                  >
                    Saludo general
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage('¡Hola! Te recordamos que tienes una cita programada. ¿Necesitas confirmar o reprogramar?')}
                    className="text-left justify-start"
                  >
                    Recordatorio de cita
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage('¡Hola! Tenemos una promoción especial que te puede interesar. ¿Te gustaría conocer más detalles?')}
                    className="text-left justify-start"
                  >
                    Promoción especial
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage('¡Hola! ¿Cómo está tu mascota después del último servicio? ¿Todo bien?')}
                    className="text-left justify-start"
                  >
                    Seguimiento post-servicio
                  </Button>
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
                Iniciar Conversación
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}