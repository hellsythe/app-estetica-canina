export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
}

export interface AuthToken {
  user: User;
  exp: number;
  iat: number;
}

// Mock users database - en producción esto vendría de una base de datos real
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 1,
    email: 'admin@petstyle.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    avatar: 'AD'
  },
  {
    id: 2,
    email: 'manager@petstyle.com',
    password: 'manager123',
    name: 'Gerente',
    role: 'manager',
    avatar: 'GE'
  },
  {
    id: 3,
    email: 'empleado@petstyle.com',
    password: 'empleado123',
    name: 'Ana García',
    role: 'employee',
    avatar: 'AG'
  }
];

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simular delay de autenticación
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const generateToken = (user: User): string => {
  const token = {
    user,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  };
  return btoa(JSON.stringify(token));
};

export const verifyToken = (token: string): AuthToken | null => {
  try {
    const decoded = JSON.parse(atob(token)) as AuthToken;
    
    // Verificar si el token ha expirado
    if (decoded.exp < Date.now()) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'admin': 3,
    'manager': 2,
    'employee': 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Permisos por módulo
export const modulePermissions = {
  dashboard: ['admin', 'manager', 'employee'],
  employees: ['admin'],
  clients: ['admin', 'manager', 'employee'],
  services: ['admin', 'manager'],
  appointments: ['admin', 'manager', 'employee'],
  messages: ['admin', 'manager', 'employee'],
  pos: ['admin', 'manager', 'employee'],
  products: ['admin', 'manager'],
  coupons: ['admin', 'manager'],
  marketing: ['admin', 'manager'],
  'social-sharing': ['admin', 'manager'],
  billing: ['admin', 'manager'],
  reports: ['admin', 'manager'],
  'cash-register': ['admin', 'manager'],
  settings: ['admin'],
  profile: ['admin', 'manager', 'employee'] // Todos pueden acceder a su perfil
};

export const canAccessModule = (userRole: string, module: string): boolean => {
  const allowedRoles = modulePermissions[module] || [];
  return allowedRoles.includes(userRole);
};