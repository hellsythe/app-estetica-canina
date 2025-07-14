import { useState, useEffect, useCallback } from 'react';

interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  entity: string;
  data?: any;
  timestamp: number;
  retries: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem('syncQueue');
    if (savedQueue) {
      try {
        setSyncQueue(JSON.parse(savedQueue));
      } catch (error) {
        console.error('Error parsing sync queue from localStorage', error);
        localStorage.removeItem('syncQueue');
      }
    }

    // Check initial online status
    setIsOnline(navigator.onLine);

    // Set up event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Process sync queue when online
  const processSyncQueue = useCallback(async () => {
    if (!isOnline || isSyncing || syncQueue.length === 0) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Sort queue by timestamp (oldest first)
      const sortedQueue = [...syncQueue].sort((a, b) => a.timestamp - b.timestamp);
      
      // Process each item
      const newQueue = [...sortedQueue];
      let processedCount = 0;

      for (let i = 0; i < sortedQueue.length; i++) {
        const item = sortedQueue[i];
        
        try {
          // Here you would make the actual API call
          // For now, we'll just simulate success
          console.log(`Processing sync item: ${item.entity} - ${item.operation}`);
          
          // Remove the item from the queue
          newQueue.splice(i - processedCount, 1);
          processedCount++;
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Error syncing item: ${item.entity} - ${item.operation}`, error);
          
          // Increment retry count
          newQueue[i - processedCount].retries += 1;
          
          // If too many retries, remove from queue
          if (newQueue[i - processedCount].retries > 5) {
            newQueue.splice(i - processedCount, 1);
            processedCount++;
          }
          
          // Stop processing on first error
          break;
        }
      }

      // Update queue
      setSyncQueue(newQueue);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error processing sync queue', error);
      setSyncError('Error al sincronizar datos');
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, syncQueue]);

  // Add item to sync queue
  const addToSyncQueue = useCallback((item: Omit<SyncQueueItem, 'timestamp' | 'retries'>) => {
    const newItem: SyncQueueItem = {
      ...item,
      timestamp: Date.now(),
      retries: 0
    };

    setSyncQueue(prev => [...prev, newItem]);

    // If online, process queue immediately
    if (isOnline) {
      processSyncQueue();
    }
  }, [isOnline, processSyncQueue]);

  // Clear sync queue
  const clearSyncQueue = useCallback(() => {
    setSyncQueue([]);
  }, []);

  // Manually trigger sync
  const syncNow = useCallback(() => {
    if (isOnline) {
      processSyncQueue();
    }
  }, [isOnline, processSyncQueue]);

  return {
    isOnline,
    isSyncing,
    pendingSync: syncQueue.length,
    lastSyncTime,
    syncError,
    addToSyncQueue,
    clearSyncQueue,
    syncNow,
    syncStatus: {
      isOnline,
      isSyncing,
      pendingSync: syncQueue.length,
      lastSyncTime,
      syncError
    }
  };
};