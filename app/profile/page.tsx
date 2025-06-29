'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  Calendar,
  Edit,
  Upload,
  Check,
  X,
  AlertCircle,
  Bell,
  Palette,
  Globe,
  Smartphone
} from 'lucide-react';

interface ErrorState {
  [key: string]: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: 'Calle Principal 123, Ciudad',
    bio: 'Administrador del sistema PetStyle Pro con más de 5 años de experiencia en gestión de estéticas caninas.',
    birthDate: '1990-05-15',
    emergencyContact: 'María García',
    emergencyPhone: '+1 (555) 987-6543'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      appointments: true,
      marketing: false,
      reports: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false
    },
    language: 'es',
    timezone: 'America/Mexico_City',
    theme: 'light'
  });

  const [profileImage, setProfileImage] = useState(user?.avatar || '');
  const [errors, setErrors] = useState<ErrorState>({});
  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'personal', name: 'Información Personal', icon: User },
    { id: 'security', name: 'Seguridad', icon: Lock },
    { id: 'preferences', name: 'Preferencias', icon: Bell },
    { id: 'privacy', name: 'Privacidad', icon: Shield }
  ];

  const handlePersonalDataChange = (field: string, value: string) => {
    setPersonalData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors((prev: ErrorState) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors((prev: ErrorState) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePreferenceChange = (category: string, field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // En una aplicación real, aquí subirías la imagen a un servidor
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePersonalData = () => {
    const newErrors: ErrorState = {};

    if (!personalData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!personalData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(personalData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!personalData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: ErrorState = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePersonalData = () => {
    if (validatePersonalData()) {
      // Aquí implementarías la lógica para guardar los datos
      setSuccessMessage('Información personal actualizada correctamente');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChangePassword = () => {
    if (validatePassword()) {
      // Aquí implementarías la lógica para cambiar la contraseña
      setSuccessMessage('Contraseña cambiada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'manager':
        return <Briefcase className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'employee':
        return 'Empleado';
      default:
        return 'Usuario';
    }
  };

  const renderPersonalTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{personalData.name}</h2>
              <p className="text-gray-600">{personalData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getRoleColor(user?.role || '')}>
                  <div className="flex items-center gap-1">
                    {getRoleIcon(user?.role || '')}
                    {getRoleText(user?.role || '')}
                  </div>
                </Badge>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Miembro desde 2023
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre Completo</label>
              <Input
                value={personalData.name}
                onChange={(e) => handlePersonalDataChange('name', e.target.value)}
                disabled={!isEditing}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={personalData.email}
                onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                disabled={!isEditing}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <Input
                value={personalData.phone}
                onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                disabled={!isEditing}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
              <Input
                type="date"
                value={personalData.birthDate}
                onChange={(e) => handlePersonalDataChange('birthDate', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Dirección</label>
              <Input
                value={personalData.address}
                onChange={(e) => handlePersonalDataChange('address', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Biografía</label>
              <textarea
                value={personalData.bio}
                onChange={(e) => handlePersonalDataChange('bio', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contacto de Emergencia</label>
              <Input
                value={personalData.emergencyContact}
                onChange={(e) => handlePersonalDataChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Teléfono de Emergencia</label>
              <Input
                value={personalData.emergencyPhone}
                onChange={(e) => handlePersonalDataChange('emergencyPhone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePersonalData} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Contraseña Actual</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className={errors.currentPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className={errors.newPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700">
              <Lock className="h-4 w-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Autenticación de dos factores</h4>
                <p className="text-sm text-gray-600">Agregar una capa extra de seguridad a tu cuenta</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sesiones activas</h4>
                <p className="text-sm text-gray-600">Gestionar dispositivos conectados</p>
              </div>
              <Button variant="outline" size="sm">
                Ver Sesiones
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Historial de acceso</h4>
                <p className="text-sm text-gray-600">Ver intentos de inicio de sesión recientes</p>
              </div>
              <Button variant="outline" size="sm">
                Ver Historial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones por Email</h4>
                <p className="text-sm text-gray-600">Recibir notificaciones en tu correo electrónico</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones Push</h4>
                <p className="text-sm text-gray-600">Recibir notificaciones en el navegador</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones SMS</h4>
                <p className="text-sm text-gray-600">Recibir notificaciones por mensaje de texto</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.sms}
                onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Recordatorios de Citas</h4>
                <p className="text-sm text-gray-600">Notificaciones sobre citas próximas</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.appointments}
                onChange={(e) => handlePreferenceChange('notifications', 'appointments', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing y Promociones</h4>
                <p className="text-sm text-gray-600">Recibir información sobre ofertas y novedades</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.marketing}
                onChange={(e) => handlePreferenceChange('notifications', 'marketing', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reportes Automáticos</h4>
                <p className="text-sm text-gray-600">Recibir reportes periódicos del negocio</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifications.reports}
                onChange={(e) => handlePreferenceChange('notifications', 'reports', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language and Region */}
      <Card>
        <CardHeader>
          <CardTitle>Idioma y Región</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Idioma</label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Zona Horaria</label>
              <select
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                <option value="America/New_York">Nueva York (GMT-5)</option>
                <option value="Europe/Madrid">Madrid (GMT+1)</option>
                <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Privacidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Perfil Visible</h4>
                <p className="text-sm text-gray-600">Permitir que otros usuarios vean tu perfil</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.privacy.profileVisible}
                onChange={(e) => handlePreferenceChange('privacy', 'profileVisible', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mostrar Email</h4>
                <p className="text-sm text-gray-600">Mostrar tu email en el perfil público</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.privacy.showEmail}
                onChange={(e) => handlePreferenceChange('privacy', 'showEmail', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mostrar Teléfono</h4>
                <p className="text-sm text-gray-600">Mostrar tu teléfono en el perfil público</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.privacy.showPhone}
                onChange={(e) => handlePreferenceChange('privacy', 'showPhone', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Exportar Datos</h4>
                <p className="text-sm text-gray-600">Descargar una copia de tus datos</p>
              </div>
              <Button variant="outline" size="sm">
                Exportar
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Eliminar Cuenta</h4>
                <p className="text-sm text-gray-600">Eliminar permanentemente tu cuenta y datos</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                Eliminar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalTab();
      case 'security':
        return renderSecurityTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'privacy':
        return renderPrivacyTab();
      default:
        return renderPersonalTab();
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">{successMessage}</span>
            </div>
          )}

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
    </ProtectedRoute>
  );
}