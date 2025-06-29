'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MessageForm from '@/components/forms/MessageForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Send,
  Phone,
  Video,
  Paperclip,
  Smile,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      client: 'María González',
      lastMessage: 'Gracias por el excelente servicio con Max',
      timestamp: '10:30 AM',
      unread: 0,
      status: 'online',
      avatar: 'MG'
    },
    {
      id: 2,
      client: 'Carlos Ruiz',
      lastMessage: '¿Tienen disponibilidad para mañana?',
      timestamp: '9:45 AM',
      unread: 2,
      status: 'offline',
      avatar: 'CR'
    },
    {
      id: 3,
      client: 'Ana Martínez',
      lastMessage: 'Luna está muy contenta después del corte',
      timestamp: 'Ayer',
      unread: 0,
      status: 'online',
      avatar: 'AM'
    },
    {
      id: 4,
      client: 'Luis Fernández',
      lastMessage: '¿Cuál es el precio del baño completo?',
      timestamp: 'Ayer',
      unread: 1,
      status: 'offline',
      avatar: 'LF'
    }
  ]);

  const messages = [
    {
      id: 1,
      sender: 'client',
      content: 'Hola, ¿tienen disponibilidad para mañana por la tarde?',
      timestamp: '9:30 AM',
      status: 'read'
    },
    {
      id: 2,
      sender: 'admin',
      content: 'Hola María! Sí, tenemos disponibilidad mañana a las 3:00 PM y 4:30 PM. ¿Cuál te conviene más?',
      timestamp: '9:32 AM',
      status: 'read'
    },
    {
      id: 3,
      sender: 'client',
      content: 'Perfecto, me quedo con las 3:00 PM. ¿Es para Max, el servicio completo?',
      timestamp: '9:35 AM',
      status: 'read'
    },
    {
      id: 4,
      sender: 'admin',
      content: 'Excelente! Ya tienes reservada la cita para Max mañana a las 3:00 PM - Baño y Corte Completo. Te enviaremos un recordatorio.',
      timestamp: '9:37 AM',
      status: 'delivered'
    },
    {
      id: 5,
      sender: 'client',
      content: 'Gracias por el excelente servicio con Max',
      timestamp: '10:30 AM',
      status: 'read'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleNewConversation = () => {
    setIsFormOpen(true);
  };

  const handleSaveConversation = (conversationData: any) => {
    setConversations(prev => [conversationData, ...prev]);
    setSelectedChat(conversationData.id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí implementarías la lógica para enviar el mensaje
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mensajería</h1>
            <p className="text-gray-600">Comunícate con tus clientes de forma directa</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewConversation}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Conversación
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversaciones Activas</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations.length}</div>
              <p className="text-xs text-gray-500">+3 nuevas hoy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensajes No Leídos</CardTitle>
              <MessageSquare className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations.reduce((sum, conv) => sum + conv.unread, 0)}</div>
              <p className="text-xs text-gray-500">Requieren atención</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Respuesta</CardTitle>
              <Clock className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 min</div>
              <p className="text-xs text-gray-500">Promedio</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              <MessageSquare className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-gray-500">Clientes satisfechos</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversaciones</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[480px] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedChat === conversation.id 
                        ? 'bg-blue-50 border-blue-500' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {conversation.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          conversation.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-900 truncate">{conversation.client}</h4>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation && (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedConversation.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          selectedConversation.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.client}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.status === 'online' ? 'En línea' : 'Desconectado'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'admin'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{message.timestamp}</span>
                            {message.sender === 'admin' && (
                              message.status === 'read' ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Message Form Modal */}
        <MessageForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveConversation}
        />
      </div>
    </DashboardLayout>
  );
}