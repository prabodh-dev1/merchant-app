import { UserRole } from './types';

const HARDCODED_USERS = [
  {
    id: '1',
    email: 'admin@bluboy.com',
    password: 'password123',
    name: 'Super Admin',
    role: 'SUPER_ADMIN' as UserRole,
    firebase_uid: 'super-admin-uid',
  },
  {
    id: '2',
    email: 'marketing@bluboy.com',
    password: 'password123',
    name: 'Marketing Admin',
    role: 'TENANT_MARKETING_ADMIN' as UserRole,
    firebase_uid: 'marketing-admin-uid',
  },
  {
    id: '3',
    email: 'merchant@ccd.com',
    password: 'password123',
    name: 'CCD Admin',
    role: 'MERCHANT_ADMIN' as UserRole,
    firebase_uid: 'merchant-admin-uid',
  },
];

export function validateCredentials(email: string, password: string) {
  const user = HARDCODED_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function getUserFromSession(sessionData: string | null) {
  if (!sessionData) return null;

  try {
    return JSON.parse(sessionData);
  } catch {
    return null;
  }
}

export function canAccessRoute(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}
