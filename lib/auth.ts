export interface User {
  access_token: string;
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

export interface AuthToken {
  user: User;
  exp: number;
  iat: number;
}


export const authenticateUser = async (email: string, password: string): Promise<string | null> => {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    const responseJson = await response.json();

    return responseJson.access_token;
  }
  return null;
};

export const verifyToken = (token: string): AuthToken | null => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])) as AuthToken;

    // Verificar si el token ha expirado
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
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