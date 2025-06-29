'use client';

import { useAuth } from '@/contexts/AuthContext';
import { canAccessModule } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
}

export default function ProtectedRoute({ children, requiredModule }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      // Verificar permisos del módulo si se especifica
      if (requiredModule && !canAccessModule(user.role, requiredModule)) {
        router.push('/unauthorized');
        return;
      }

      // Verificar permisos basado en la ruta actual
      const currentModule = pathname.split('/')[1] || 'dashboard';
      if (currentModule && !canAccessModule(user.role, currentModule)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, isLoading, router, requiredModule, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Verificar permisos del módulo
  const currentModule = requiredModule || pathname.split('/')[1] || 'dashboard';
  if (!canAccessModule(user.role, currentModule)) {
    return null;
  }

  return <>{children}</>;
}