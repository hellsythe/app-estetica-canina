'use client';

import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface SyncStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export default function SyncStatusIndicator({ showDetails = false, className = '' }: SyncStatusIndicatorProps) {
  const { syncStatus, forcSync } = useOfflineSync();

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'bg-red-100 text-red-800';
    if (syncStatus.pendingSync > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = () => {
    if (syncStatus.syncInProgress) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (!syncStatus.isOnline) {
      return <WifiOff className="h-4 w-4" />;
    }
    if (syncStatus.pendingSync > 0) {
      return <Clock className="h-4 w-4" />;
    }
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (syncStatus.syncInProgress) return 'Sincronizando...';
    if (!syncStatus.isOnline) return 'Sin conexión';
    if (syncStatus.pendingSync > 0) return `${syncStatus.pendingSync} pendientes`;
    return 'Sincronizado';
  };

  if (!showDetails) {
    return (
      <Badge className={`${getStatusColor()} ${className}`}>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className="text-xs">{getStatusText()}</span>
        </div>
      </Badge>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Estado de Sincronización</h3>
          <Badge className={getStatusColor()}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="text-xs">{getStatusText()}</span>
            </div>
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Conexión:</span>
            <div className="flex items-center gap-1">
              {syncStatus.isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className={syncStatus.isOnline ? 'text-green-600' : 'text-red-600'}>
                {syncStatus.isOnline ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>

          {syncStatus.pendingSync > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Pendientes:</span>
              <span className="text-yellow-600">{syncStatus.pendingSync} elementos</span>
            </div>
          )}

          {syncStatus.lastSyncAttempt && (
            <div className="flex justify-between">
              <span className="text-gray-600">Último intento:</span>
              <span className="text-gray-800">
                {syncStatus.lastSyncAttempt.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {syncStatus.isOnline && syncStatus.pendingSync > 0 && (
          <Button
            onClick={forcSync}
            disabled={syncStatus.syncInProgress}
            size="sm"
            className="w-full mt-3"
          >
            {syncStatus.syncInProgress ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar Ahora
              </>
            )}
          </Button>
        )}

        {!syncStatus.isOnline && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-800">
                Trabajando offline. Los cambios se sincronizarán cuando vuelva la conexión.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}