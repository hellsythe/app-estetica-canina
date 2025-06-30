export interface SyncableData {
  id: string | number;
  lastModified: number;
  synced: boolean;
  action: 'create' | 'update' | 'delete';
  data: any;
}

export interface StorageManager {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  remove: (key: string) => void;
  clear: () => void;
  getAll: () => Record<string, any>;
}

class LocalStorageManager implements StorageManager {
  get(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          result[key] = this.get(key);
        }
      }
    } catch (error) {
      console.error('Error getting all from localStorage:', error);
    }
    return result;
  }
}

export const storage = new LocalStorageManager();

// Gestión de datos sincronizables
export class SyncManager {
  private syncQueue: SyncableData[] = [];
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    this.loadSyncQueue();
    this.setupOnlineListener();
  }

  private loadSyncQueue(): void {
    const queue = storage.get('sync_queue');
    this.syncQueue = queue || [];
  }

  private saveSyncQueue(): void {
    storage.set('sync_queue', this.syncQueue);
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  addToSyncQueue(data: Omit<SyncableData, 'lastModified' | 'synced'>): void {
    const syncData: SyncableData = {
      ...data,
      lastModified: Date.now(),
      synced: false
    };

    // Buscar si ya existe una entrada para este item
    const existingIndex = this.syncQueue.findIndex(
      item => item.id === data.id && item.action !== 'delete'
    );

    if (existingIndex !== -1) {
      // Actualizar entrada existente
      this.syncQueue[existingIndex] = syncData;
    } else {
      // Agregar nueva entrada
      this.syncQueue.push(syncData);
    }

    this.saveSyncQueue();

    // Intentar sincronizar si estamos online
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const unsyncedItems = this.syncQueue.filter(item => !item.synced);
      
      for (const item of unsyncedItems) {
        try {
          await this.syncItem(item);
          item.synced = true;
        } catch (error) {
          console.error('Error syncing item:', error);
          // Si falla la sincronización, mantener el item en la cola
          break;
        }
      }

      // Remover items sincronizados
      this.syncQueue = this.syncQueue.filter(item => !item.synced);
      this.saveSyncQueue();

    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: SyncableData): Promise<void> {
    // Simular API call - aquí implementarías las llamadas reales a tu API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Syncing ${item.action} for item ${item.id}:`, item.data);
        
        // Simular éxito/fallo aleatorio para testing
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Sync failed'));
        }
      }, 1000);
    });
  }

  getSyncQueueStatus(): { pending: number; total: number } {
    const pending = this.syncQueue.filter(item => !item.synced).length;
    return { pending, total: this.syncQueue.length };
  }

  isOnlineStatus(): boolean {
    return this.isOnline;
  }
}

export const syncManager = new SyncManager();

// Funciones de utilidad para diferentes tipos de datos
export const dataManager = {
  // Clientes
  clients: {
    getAll: () => storage.get('clients') || [],
    save: (clients: any[]) => storage.set('clients', clients),
    add: (client: any) => {
      const clients = dataManager.clients.getAll();
      const newClient = { ...client, id: client.id || Date.now() };
      clients.push(newClient);
      dataManager.clients.save(clients);
      
      syncManager.addToSyncQueue({
        id: newClient.id,
        action: 'create',
        data: newClient
      });
      
      return newClient;
    },
    update: (id: string | number, updates: any) => {
      const clients = dataManager.clients.getAll();
      const index = clients.findIndex(c => c.id === id);
      if (index !== -1) {
        clients[index] = { ...clients[index], ...updates };
        dataManager.clients.save(clients);
        
        syncManager.addToSyncQueue({
          id,
          action: 'update',
          data: clients[index]
        });
      }
    },
    delete: (id: string | number) => {
      const clients = dataManager.clients.getAll();
      const filtered = clients.filter(c => c.id !== id);
      dataManager.clients.save(filtered);
      
      syncManager.addToSyncQueue({
        id,
        action: 'delete',
        data: { id }
      });
    }
  },

  // Citas
  appointments: {
    getAll: () => storage.get('appointments') || [],
    save: (appointments: any[]) => storage.set('appointments', appointments),
    add: (appointment: any) => {
      const appointments = dataManager.appointments.getAll();
      const newAppointment = { ...appointment, id: appointment.id || Date.now() };
      appointments.push(newAppointment);
      dataManager.appointments.save(appointments);
      
      syncManager.addToSyncQueue({
        id: newAppointment.id,
        action: 'create',
        data: newAppointment
      });
      
      return newAppointment;
    },
    update: (id: string | number, updates: any) => {
      const appointments = dataManager.appointments.getAll();
      const index = appointments.findIndex(a => a.id === id);
      if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates };
        dataManager.appointments.save(appointments);
        
        syncManager.addToSyncQueue({
          id,
          action: 'update',
          data: appointments[index]
        });
      }
    },
    delete: (id: string | number) => {
      const appointments = dataManager.appointments.getAll();
      const filtered = appointments.filter(a => a.id !== id);
      dataManager.appointments.save(filtered);
      
      syncManager.addToSyncQueue({
        id,
        action: 'delete',
        data: { id }
      });
    }
  },

  // Servicios
  services: {
    getAll: () => storage.get('services') || [],
    save: (services: any[]) => storage.set('services', services),
    add: (service: any) => {
      const services = dataManager.services.getAll();
      const newService = { ...service, id: service.id || Date.now() };
      services.push(newService);
      dataManager.services.save(services);
      
      syncManager.addToSyncQueue({
        id: newService.id,
        action: 'create',
        data: newService
      });
      
      return newService;
    },
    update: (id: string | number, updates: any) => {
      const services = dataManager.services.getAll();
      const index = services.findIndex(s => s.id === id);
      if (index !== -1) {
        services[index] = { ...services[index], ...updates };
        dataManager.services.save(services);
        
        syncManager.addToSyncQueue({
          id,
          action: 'update',
          data: services[index]
        });
      }
    },
    delete: (id: string | number) => {
      const services = dataManager.services.getAll();
      const filtered = services.filter(s => s.id !== id);
      dataManager.services.save(filtered);
      
      syncManager.addToSyncQueue({
        id,
        action: 'delete',
        data: { id }
      });
    }
  },

  // Productos
  products: {
    getAll: () => storage.get('products') || [],
    save: (products: any[]) => storage.set('products', products),
    add: (product: any) => {
      const products = dataManager.products.getAll();
      const newProduct = { ...product, id: product.id || Date.now() };
      products.push(newProduct);
      dataManager.products.save(products);
      
      syncManager.addToSyncQueue({
        id: newProduct.id,
        action: 'create',
        data: newProduct
      });
      
      return newProduct;
    },
    update: (id: string | number, updates: any) => {
      const products = dataManager.products.getAll();
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        dataManager.products.save(products);
        
        syncManager.addToSyncQueue({
          id,
          action: 'update',
          data: products[index]
        });
      }
    },
    delete: (id: string | number) => {
      const products = dataManager.products.getAll();
      const filtered = products.filter(p => p.id !== id);
      dataManager.products.save(filtered);
      
      syncManager.addToSyncQueue({
        id,
        action: 'delete',
        data: { id }
      });
    }
  },

  // Empleados
  employees: {
    getAll: () => storage.get('employees') || [],
    save: (employees: any[]) => storage.set('employees', employees),
    add: (employee: any) => {
      const employees = dataManager.employees.getAll();
      const newEmployee = { ...employee, id: employee.id || Date.now() };
      employees.push(newEmployee);
      dataManager.employees.save(employees);
      
      syncManager.addToSyncQueue({
        id: newEmployee.id,
        action: 'create',
        data: newEmployee
      });
      
      return newEmployee;
    },
    update: (id: string | number, updates: any) => {
      const employees = dataManager.employees.getAll();
      const index = employees.findIndex(e => e.id === id);
      if (index !== -1) {
        employees[index] = { ...employees[index], ...updates };
        dataManager.employees.save(employees);
        
        syncManager.addToSyncQueue({
          id,
          action: 'update',
          data: employees[index]
        });
      }
    },
    delete: (id: string | number) => {
      const employees = dataManager.employees.getAll();
      const filtered = employees.filter(e => e.id !== id);
      dataManager.employees.save(filtered);
      
      syncManager.addToSyncQueue({
        id,
        action: 'delete',
        data: { id }
      });
    }
  }
};