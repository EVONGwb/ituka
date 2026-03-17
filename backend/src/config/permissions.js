export const ROLE_PERMISSIONS = {
  admin: ['*'],
  operator: [
    'admin:access',
    'dashboard:read',
    'chats:read',
    'chats:write',
    'requests:read',
    'requests:update',
    'orders:read',
    'clients:read'
  ],
  viewer: [
    'admin:access',
    'dashboard:read',
    'analytics:read',
    'orders:read',
    'clients:read',
  ],
  sales: [
    'admin:access',
    'dashboard:read',
    'analytics:read',
    'orders:read',
    'clients:read'
  ],
  customer: []
};

export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
}
