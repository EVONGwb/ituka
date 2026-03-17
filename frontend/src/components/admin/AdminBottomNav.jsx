import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, MessageSquare, ShoppingBag, Settings } from 'lucide-react';

const tabs = [
  {
    key: 'home',
    label: 'Inicio',
    to: '/admin',
    matches: [/^\/admin\/?$/, /^\/admin\/dashboard(\/|$)/, /^\/admin\/analytics(\/|$)/],
    icon: Home
  },
  {
    key: 'requests',
    label: 'Solicitudes',
    to: '/admin/requests',
    matches: [/^\/admin\/requests(\/|$)/],
    icon: FileText
  },
  {
    key: 'chats',
    label: 'Chats',
    to: '/admin/chats',
    matches: [/^\/admin\/chats(\/|$)/],
    icon: MessageSquare
  },
  {
    key: 'orders',
    label: 'Pedidos',
    to: '/admin/orders',
    matches: [/^\/admin\/orders(\/|$)/],
    icon: ShoppingBag
  },
  {
    key: 'settings',
    label: 'Ajustes',
    to: '/admin/settings',
    matches: [/^\/admin\/settings(\/|$)/],
    icon: Settings
  }
];

export default function AdminBottomNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const activeTabKey = tabs.find((t) => t.matches.some((r) => r.test(pathname)))?.key;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="bg-ituka-surface/95 backdrop-blur-md border-t border-ituka-border/70 shadow-ituka-float">
        <div className="h-20 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="h-full grid grid-cols-5 items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabKey === tab.key;

              return (
                <NavLink
                  key={tab.key}
                  to={tab.to}
                  className={
                    `flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-colors ` +
                    (isActive ? 'text-ituka-gold' : 'text-ituka-ink/45 hover:text-ituka-ink')
                  }
                >
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                  <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

