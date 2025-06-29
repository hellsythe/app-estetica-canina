'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authenticateUser, generateToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Shield,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const demoAccounts = [
    {
      email: 'admin@petstyle.com',
      password: 'admin123',
      role: 'Administrador',
      description: 'Acceso completo a todas las funciones',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      email: 'manager@petstyle.com',
      password: 'manager123',
      role: 'Gerente',
      description: 'Gestión de operaciones y reportes',
      icon: Briefcase,
      color: 'bg-blue-500'
    },
    {
      email: 'empleado@petstyle.com',
      password: 'empleado123',
      role: 'Empleado',
      description: 'Acceso a citas, clientes y POS',
      icon: User,
      color: 'bg-green-500'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authenticateUser(formData.email, formData.password);
      
      if (user) {
        const token = generateToken(user);
        login(token);
        router.push('/');
      } else {
        setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">PetStyle Pro</CardTitle>
            <p className="text-gray-600">Sistema de Gestión para Estética Canina</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Tu contraseña"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Olvidaste tu contraseña?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Recuperar contraseña
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cuentas de Demostración</h2>
            <p className="text-gray-600">Prueba el sistema con diferentes niveles de acceso</p>
          </div>

          <div className="space-y-4">
            {demoAccounts.map((account, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                onClick={() => handleDemoLogin(account.email, account.password)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${account.color} rounded-full flex items-center justify-center`}>
                      <account.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{account.role}</h3>
                        <Badge variant="outline" className="text-xs">Demo</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{account.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Email:</span> {account.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Contraseña:</span> {account.password}
                        </p>
                      </div>
                    </div>
                    <div className="text-blue-600">
                      <LogIn className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Permisos por Rol:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-red-700">Administrador:</span>
                  <span className="text-gray-700"> Acceso completo, incluyendo configuración y empleados</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Gerente:</span>
                  <span className="text-gray-700"> Gestión operativa, reportes, marketing (sin configuración)</span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Empleado:</span>
                  <span className="text-gray-700"> Citas, clientes, POS y mensajería</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}