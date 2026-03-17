export const ROLE_PERMISSIONS = {
  admin: ['*'],
  operator: ['admin:access', 'dashboard:read', 'chats:read', 'chats:write', 'requests:read', 'requests:update', 'orders:read', 'clients:read'],
  viewer: ['admin:access', 'dashboard:read', 'orders:read', 'clients:read', 'analytics:read'],
  sales: ['admin:access', 'dashboard:read', 'orders:read', 'clients:read', 'analytics:read'],
  customer: []
};

export function can(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
}

export function isStaff(role) {
  return can(role, 'admin:access');
}
