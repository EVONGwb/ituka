import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, MessageSquare, ShoppingCart, User } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Inicio', icon: Home },
  { to: '/cart', label: 'Cesta', icon: ShoppingCart },
  { to: '/requests', label: 'Solicitudes', icon: ClipboardList },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/profile', label: 'Perfil', icon: User }
];

export default function CustomerBottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const activeKey = (() => {
    if (pathname === '/cart') return '/cart';
    if (pathname === '/requests') return '/requests';
    if (pathname === '/chat') return '/chat';
    if (pathname === '/profile') return '/profile';
    if (pathname === '/dashboard') return '/dashboard';
    if (pathname.startsWith('/products')) return '/dashboard';
    return null;
  })();

  return (
    <nav className="fixed left-0 right-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t border-ituka-border">
      <div className="max-w-2xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {items.map((item) => {
            const isActive = activeKey === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex-1 h-16 flex flex-col items-center justify-center gap-1"
                aria-label={item.label}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-ituka-gold' : 'text-ituka-ink/45'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-ituka-gold' : 'text-ituka-ink/45'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
