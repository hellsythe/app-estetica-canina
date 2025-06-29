'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  ArrowLeft, 
  Home,
  AlertTriangle
} from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              No tienes permisos para acceder a esta sección
            </span>
          </div>

          <div className="text-gray-600">
            <p className="mb-2">Tu rol actual: <span className="font-semibold">{user?.role}</span></p>
            <p className="text-sm">
              Contacta al administrador si necesitas acceso a esta funcionalidad.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Home className="h-4 w-4" />
              Ir al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}