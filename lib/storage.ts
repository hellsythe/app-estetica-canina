// Local storage manager for offline support

// Generic storage manager
export const storageManager = {
  // Set item with expiration
  setItem: (key: string, value: any, expirationMinutes: number = 0) => {
    const item = {
      value,
      expiration: expirationMinutes > 0 ? Date.now() + (expirationMinutes * 60 * 1000) : 0,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // Get item and check expiration
  getItem: (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      
      // Check if expired
      if (item.expiration && item.expiration < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Error parsing item from localStorage', error);
      return null;
    }
  },

  // Remove item
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  // Clear all items with a specific prefix
  clearWithPrefix: (prefix: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
};

// Data managers for specific entity types
export const dataManager = {
  // Clients
  clients: {
    getAll: () => storageManager.getItem('clients') || [],
    getById: (id: string) => {
      const clients = storageManager.getItem('clients') || [];
      return clients.find((client: any) => client.id === id) || null;
    },
    save: (clients: any[]) => storageManager.setItem('clients', clients),
    add: (client: any) => {
      const clients = storageManager.getItem('clients') || [];
      clients.push(client);
      storageManager.setItem('clients', clients);
      return client;
    },
    update: (id: string, data: any) => {
      const clients = storageManager.getItem('clients') || [];
      const index = clients.findIndex((client: any) => client.id === id);
      if (index !== -1) {
        clients[index] = { ...clients[index], ...data };
        storageManager.setItem('clients', clients);
        return clients[index];
      }
      return null;
    },
    remove: (id: string) => {
      const clients = storageManager.getItem('clients') || [];
      const filtered = clients.filter((client: any) => client.id !== id);
      storageManager.setItem('clients', filtered);
    }
  },

  // Appointments
  appointments: {
    getAll: () => storageManager.getItem('appointments') || [],
    getById: (id: string) => {
      const appointments = storageManager.getItem('appointments') || [];
      return appointments.find((appointment: any) => appointment.id === id) || null;
    },
    save: (appointments: any[]) => storageManager.setItem('appointments', appointments),
    add: (appointment: any) => {
      const appointments = storageManager.getItem('appointments') || [];
      appointments.push(appointment);
      storageManager.setItem('appointments', appointments);
      return appointment;
    },
    update: (id: string, data: any) => {
      const appointments = storageManager.getItem('appointments') || [];
      const index = appointments.findIndex((appointment: any) => appointment.id === id);
      if (index !== -1) {
        appointments[index] = { ...appointments[index], ...data };
        storageManager.setItem('appointments', appointments);
        return appointments[index];
      }
      return null;
    },
    remove: (id: string) => {
      const appointments = storageManager.getItem('appointments') || [];
      const filtered = appointments.filter((appointment: any) => appointment.id !== id);
      storageManager.setItem('appointments', filtered);
    }
  },

  // Services
  services: {
    getAll: () => storageManager.getItem('services') || [],
    getById: (id: string) => {
      const services = storageManager.getItem('services') || [];
      return services.find((service: any) => service.id === id) || null;
    },
    save: (services: any[]) => storageManager.setItem('services', services),
    add: (service: any) => {
      const services = storageManager.getItem('services') || [];
      services.push(service);
      storageManager.setItem('services', services);
      return service;
    },
    update: (id: string, data: any) => {
      const services = storageManager.getItem('services') || [];
      const index = services.findIndex((service: any) => service.id === id);
      if (index !== -1) {
        services[index] = { ...services[index], ...data };
        storageManager.setItem('services', services);
        return services[index];
      }
      return null;
    },
    remove: (id: string) => {
      const services = storageManager.getItem('services') || [];
      const filtered = services.filter((service: any) => service.id !== id);
      storageManager.setItem('services', filtered);
    }
  },

  // Products
  products: {
    getAll: () => storageManager.getItem('products') || [],
    getById: (id: string) => {
      const products = storageManager.getItem('products') || [];
      return products.find((product: any) => product.id === id) || null;
    },
    save: (products: any[]) => storageManager.setItem('products', products),
    add: (product: any) => {
      const products = storageManager.getItem('products') || [];
      products.push(product);
      storageManager.setItem('products', products);
      return product;
    },
    update: (id: string, data: any) => {
      const products = storageManager.getItem('products') || [];
      const index = products.findIndex((product: any) => product.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...data };
        storageManager.setItem('products', products);
        return products[index];
      }
      return null;
    },
    remove: (id: string) => {
      const products = storageManager.getItem('products') || [];
      const filtered = products.filter((product: any) => product.id !== id);
      storageManager.setItem('products', filtered);
    }
  },

  // Employees
  employees: {
    getAll: () => storageManager.getItem('employees') || [],
    getById: (id: string) => {
      const employees = storageManager.getItem('employees') || [];
      return employees.find((employee: any) => employee.id === id) || null;
    },
    save: (employees: any[]) => storageManager.setItem('employees', employees),
    add: (employee: any) => {
      const employees = storageManager.getItem('employees') || [];
      employees.push(employee);
      storageManager.setItem('employees', employees);
      return employee;
    },
    update: (id: string, data: any) => {
      const employees = storageManager.getItem('employees') || [];
      const index = employees.findIndex((employee: any) => employee.id === id);
      if (index !== -1) {
        employees[index] = { ...employees[index], ...data };
        storageManager.setItem('employees', employees);
        return employees[index];
      }
      return null;
    },
    remove: (id: string) => {
      const employees = storageManager.getItem('employees') || [];
      const filtered = employees.filter((employee: any) => employee.id !== id);
      storageManager.setItem('employees', filtered);
    }
  },

  // Cages
  cages: {
    getAll: () => storageManager.getItem('cages') || [],
    getById: (id: string) => {
      const cages = storageManager.getItem('cages') || [];
      return cages.find((cage: any) => cage.id === id) || null;
    },
    save: (cages: any[]) => storageManager.setItem('cages', cages),
    add: (cage: any) => {
      const cages = storageManager.getItem('cages') || [];
      cages.push(cage);
      storageManager.setItem('cages', cages);
      return cage;
    },
    update: (id: string, data: any) => {
      const cages = storageManager.getItem('cages') || [];
      const index = cages.findIndex((cage: any) => cage.id === id);
      if (index !== -1) {
        cages[index] = { ...cages[index], ...data };
        storageManager.setItem('cages', cages);
        return cages[index];
      }
      return null;
    },
    remove: (id: string) => {
      const cages = storageManager.getItem('cages') || [];
      const filtered = cages.filter((cage: any) => cage.id !== id);
      storageManager.setItem('cages', filtered);
    }
  },

  // Pension Stays
  pensionStays: {
    getAll: () => storageManager.getItem('pensionStays') || [],
    getById: (id: string) => {
      const stays = storageManager.getItem('pensionStays') || [];
      return stays.find((stay: any) => stay.id === id) || null;
    },
    save: (stays: any[]) => storageManager.setItem('pensionStays', stays),
    add: (stay: any) => {
      const stays = storageManager.getItem('pensionStays') || [];
      stays.push(stay);
      storageManager.setItem('pensionStays', stays);
      return stay;
    },
    update: (id: string, data: any) => {
      const stays = storageManager.getItem('pensionStays') || [];
      const index = stays.findIndex((stay: any) => stay.id === id);
      if (index !== -1) {
        stays[index] = { ...stays[index], ...data };
        storageManager.setItem('pensionStays', stays);
        return stays[index];
      }
      return null;
    },
    remove: (id: string) => {
      const stays = storageManager.getItem('pensionStays') || [];
      const filtered = stays.filter((stay: any) => stay.id !== id);
      storageManager.setItem('pensionStays', filtered);
    }
  }
};