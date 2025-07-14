import { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SyncStatusIndicatorProps {
  isOnline: boolean;
  isSyncing: boolean;
  pendingSync: number;
  lastSyncTime: Date | null;
  onSyncNow?: () => void;
  showDetails?: boolean;
  className?: string;
}

export default function SyncStatusIndicator({
  isOnline,
  isSyncing,
  pendingSync,
  lastSyncTime,
  onSyncNow,
  showDetails = false,
  className = ''
}: SyncStatusIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatLastSyncTime = () => {
    if (!lastSyncTime) return 'Nunca';
    
    // If less than a minute ago, show "Justo ahora"
    const diffMs = Date.now() - lastSyncTime.getTime();
    if (diffMs < 60000) return 'Justo ahora';
    
    // If less than an hour ago, show minutes
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    // If less than a day ago, show hours
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Otherwise show date and time
    return lastSyncTime.toLocaleString();
  };

  return (
    <div 
      className={`flex items-center ${showDetails ? 'justify-between' : 'justify-center'} ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showDetails ? (
        <>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-amber-500" />
            )}
            <span className="text-sm">
              {isOnline ? 'Conectado' : 'Modo offline'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
            ) : pendingSync > 0 ? (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            
            <span className="text-sm">
              {isSyncing 
                ? 'Sincronizando...' 
                : pendingSync > 0 
                  ? `${pendingSync} cambios pendientes` 
                  : `Sincronizado ${formatLastSyncTime()}`
              }
            </span>
            
            {isOnline && pendingSync > 0 && onSyncNow && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSyncNow}
                disabled={isSyncing}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-1">
            {isOnline ? (
              isSyncing ? (
                <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
              ) : pendingSync > 0 ? (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )
            ) : (
              <WifiOff className="h-4 w-4 text-amber-500" />
            )}
            
            {pendingSync > 0 && (
              <span className="text-xs text-amber-600">{pendingSync}</span>
            )}
          </div>
          
          {showTooltip && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {isOnline 
                ? isSyncing 
                  ? 'Sincronizando...' 
                  : pendingSync > 0 
                    ? `${pendingSync} cambios pendientes` 
                    : `Sincronizado ${formatLastSyncTime()}`
                : 'Modo offline'
              }
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}