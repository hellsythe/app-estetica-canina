'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Clock, 
  Calendar,
  Plus,
  Trash2,
  Edit,
  Save,
  Facebook,
  MessageCircle,
  Instagram,
  Twitter,
  Link,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Smartphone,
  Mail,
  MapPin,
  Phone,
  User,
  Building,
  Palette,
  Bell,
  Shield,
  Database,
  Wifi,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [workingHours, setWorkingHours] = useState({
    monday: { enabled: true, start: '09:00', end: '18:00' },
    tuesday: { enabled: true, start: '09:00', end: '18:00' },
    wednesday: { enabled: true, start: '09:00', end: '18:00' },
    thursday: { enabled: true, start: '09:00', end: '18:00' },
    friday: { enabled: true, start: '09:00', end: '18:00' },
    saturday: { enabled: true, start: '10:00', end: '16:00' },
    sunday: { enabled: false, start: '10:00', end: '16:00' }
  });

  const [holidays, setHolidays] = useState([
    { id: 1, name: 'Año Nuevo', date: '2024-01-01', type: 'national' },
    { id: 2, name: 'Día del Trabajo', date: '2024-05-01', type: 'national' },
    { id: 3, name: 'Independencia', date: '2024-09-16', type: 'national' },
    { id: 4, name: 'Navidad', date: '2024-12-25', type: 'national' },
    { id: 5, name: 'Vacaciones de Verano', date: '2024-07-15', type: 'business' }
  ]);

  const [specialHours, setSpecialHours] = useState([
    { id: 1, name: 'Horario de Verano', startDate: '2024-06-01', endDate: '2024-08-31', hours: '08:00-19:00' },
    { id: 2, name: 'Horario Navideño', startDate: '2024-12-15', endDate: '2024-12-31', hours: '10:00-15:00' }
  ]);

  const [socialAccounts, setSocialAccounts] = useState({
    facebook: { connected: true, username: '@petstyle_oficial', followers: '2.5K' },
    whatsapp: { connected: true, number: '+1 (555) 123-4567', verified: true },
    instagram: { connected: false, username: '', followers: '0' },
    twitter: { connected: false, username: '', followers: '0' }
  });

  const [businessInfo, setBusinessInfo] = useState({
    name: 'PetStyle Pro',
    description: 'Estética canina profesional con más de 10 años de experiencia',
    address: 'Calle Principal 123, Ciudad, Estado',
    phone: '+1 (555) 123-4567',
    email: 'info@petstyle.com',
    website: 'www.petstyle.com',
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981'
  });

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const tabs = [
    { id: 'schedule', name: 'Horarios', icon: Clock },
    { id: 'social', name: 'Redes Sociales', icon: Globe },
    { id: 'business', name: 'Negocio', icon: Building },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'system', name: 'Sistema', icon: Monitor }
  ];

  const updateWorkingHours = (day: string, field: string, value: any) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const addHoliday = () => {
    const newHoliday = {
      id: Date.now(),
      name: 'Nuevo Feriado',
      date: new Date().toISOString().split('T')[0],
      type: 'business'
    };
    setHolidays([...holidays, newHoliday]);
  };

  const removeHoliday = (id: number) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const addSpecialHours = () => {
    const newSpecialHours = {
      id: Date.now(),
      name: 'Horario Especial',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      hours: '09:00-18:00'
    };
    setSpecialHours([...specialHours, newSpecialHours]);
  };

  const removeSpecialHours = (id: number) => {
    setSpecialHours(specialHours.filter(h => h.id !== id));
  };

  const connectSocialAccount = (platform: string) => {
    // Simular conexión a red social
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: true
      }
    }));
  };

  const disconnectSocialAccount = (platform: string) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: false
      }
    }));
  };

  const renderScheduleTab = () => (
    <div className="space-y-6">
      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horarios de Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(workingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={hours.enabled}
                    onChange={(e) => updateWorkingHours(day, 'enabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="font-medium w-24">{dayNames[day]}</span>
                </div>
                {hours.enabled ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={hours.start}
                      onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                      className="w-32"
                    />
                    <span>a</span>
                    <Input
                      type="time"
                      value={hours.end}
                      onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                      className="w-32"
                    />
                  </div>
                ) : (
                  <Badge variant="outline">Cerrado</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Holidays */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Días Feriados
            </CardTitle>
            <Button onClick={addHoliday} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Feriado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <Input
                    value={holiday.name}
                    onChange={(e) => {
                      setHolidays(holidays.map(h => 
                        h.id === holiday.id ? { ...h, name: e.target.value } : h
                      ));
                    }}
                    placeholder="Nombre del feriado"
                  />
                  <Input
                    type="date"
                    value={holiday.date}
                    onChange={(e) => {
                      setHolidays(holidays.map(h => 
                        h.id === holiday.id ? { ...h, date: e.target.value } : h
                      ));
                    }}
                  />
                  <select
                    value={holiday.type}
                    onChange={(e) => {
                      setHolidays(holidays.map(h => 
                        h.id === holiday.id ? { ...h, type: e.target.value } : h
                      ));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="national">Nacional</option>
                    <option value="business">Negocio</option>
                  </select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHoliday(holiday.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios Especiales
            </CardTitle>
            <Button onClick={addSpecialHours} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Horario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {specialHours.map((special) => (
              <div key={special.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <Input
                    value={special.name}
                    onChange={(e) => {
                      setSpecialHours(specialHours.map(s => 
                        s.id === special.id ? { ...s, name: e.target.value } : s
                      ));
                    }}
                    placeholder="Nombre del horario"
                  />
                  <Input
                    type="date"
                    value={special.startDate}
                    onChange={(e) => {
                      setSpecialHours(specialHours.map(s => 
                        s.id === special.id ? { ...s, startDate: e.target.value } : s
                      ));
                    }}
                  />
                  <Input
                    type="date"
                    value={special.endDate}
                    onChange={(e) => {
                      setSpecialHours(specialHours.map(s => 
                        s.id === special.id ? { ...s, endDate: e.target.value } : s
                      ));
                    }}
                  />
                  <Input
                    value={special.hours}
                    onChange={(e) => {
                      setSpecialHours(specialHours.map(s => 
                        s.id === special.id ? { ...s, hours: e.target.value } : s
                      ));
                    }}
                    placeholder="09:00-18:00"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpecialHours(special.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      {/* Facebook */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            Facebook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {socialAccounts.facebook.connected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Conectado</span>
                  </div>
                  <p className="text-sm text-gray-600">Usuario: {socialAccounts.facebook.username}</p>
                  <p className="text-sm text-gray-600">Seguidores: {socialAccounts.facebook.followers}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>No conectado</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {socialAccounts.facebook.connected ? (
                <>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disconnectSocialAccount('facebook')}
                  >
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => connectSocialAccount('facebook')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            WhatsApp Business
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {socialAccounts.whatsapp.connected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Conectado</span>
                    {socialAccounts.whatsapp.verified && (
                      <Badge className="bg-green-100 text-green-800">Verificado</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Número: {socialAccounts.whatsapp.number}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>No conectado</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {socialAccounts.whatsapp.connected ? (
                <>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disconnectSocialAccount('whatsapp')}
                  >
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => connectSocialAccount('whatsapp')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-600" />
            Instagram
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {socialAccounts.instagram.connected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Conectado</span>
                  </div>
                  <p className="text-sm text-gray-600">Usuario: {socialAccounts.instagram.username}</p>
                  <p className="text-sm text-gray-600">Seguidores: {socialAccounts.instagram.followers}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>No conectado</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {socialAccounts.instagram.connected ? (
                <>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disconnectSocialAccount('instagram')}
                  >
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => connectSocialAccount('instagram')}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-sky-600" />
            Twitter / X
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {socialAccounts.twitter.connected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Conectado</span>
                  </div>
                  <p className="text-sm text-gray-600">Usuario: {socialAccounts.twitter.username}</p>
                  <p className="text-sm text-gray-600">Seguidores: {socialAccounts.twitter.followers}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>No conectado</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {socialAccounts.twitter.connected ? (
                <>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disconnectSocialAccount('twitter')}
                  >
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => connectSocialAccount('twitter')}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-publicar servicios</h4>
                <p className="text-sm text-gray-600">Publicar automáticamente nuevos servicios en redes conectadas</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones de mensajes</h4>
                <p className="text-sm text-gray-600">Recibir notificaciones de mensajes de redes sociales</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sincronizar horarios</h4>
                <p className="text-sm text-gray-600">Mostrar horarios de trabajo en perfiles de redes sociales</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Información del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Negocio</label>
              <Input
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sitio Web</label>
              <Input
                value={businessInfo.website}
                onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Dirección</label>
              <Input
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <Input
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Marca y Colores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Color Primario</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={businessInfo.primaryColor}
                  onChange={(e) => setBusinessInfo({...businessInfo, primaryColor: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <Input
                  value={businessInfo.primaryColor}
                  onChange={(e) => setBusinessInfo({...businessInfo, primaryColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color Secundario</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={businessInfo.secondaryColor}
                  onChange={(e) => setBusinessInfo({...businessInfo, secondaryColor: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded"
                />
                <Input
                  value={businessInfo.secondaryColor}
                  onChange={(e) => setBusinessInfo({...businessInfo, secondaryColor: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Arrastra tu logo aquí o haz clic para seleccionar</p>
                  <Button variant="outline" size="sm">Seleccionar Archivo</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configuración de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Nuevas citas</h4>
                <p className="text-sm text-gray-600">Notificar cuando se agende una nueva cita</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Recordatorios de citas</h4>
                <p className="text-sm text-gray-600">Enviar recordatorios 24 horas antes</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Stock bajo</h4>
                <p className="text-sm text-gray-600">Alertar cuando los productos tengan stock bajo</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Nuevos mensajes</h4>
                <p className="text-sm text-gray-600">Notificar mensajes de clientes</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad y Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Cambiar Contraseña</h4>
              <div className="space-y-2">
                <Input type="password" placeholder="Contraseña actual" />
                <Input type="password" placeholder="Nueva contraseña" />
                <Input type="password" placeholder="Confirmar nueva contraseña" />
                <Button size="sm">Actualizar Contraseña</Button>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Autenticación de dos factores</h4>
                  <p className="text-sm text-gray-600">Agregar una capa extra de seguridad</p>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Configuración del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Modo oscuro</h4>
                <p className="text-sm text-gray-600">Cambiar a tema oscuro</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Actualizaciones automáticas</h4>
                <p className="text-sm text-gray-600">Instalar actualizaciones automáticamente</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Respaldo de datos</h4>
                  <p className="text-sm text-gray-600">Último respaldo: Hace 2 horas</p>
                </div>
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Crear Respaldo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return renderScheduleTab();
      case 'social':
        return renderSocialTab();
      case 'business':
        return renderBusinessTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'system':
        return renderSystemTab();
      default:
        return renderScheduleTab();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600">Gestiona la configuración de tu estética canina</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
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
      </div>
    </DashboardLayout>
  );
}