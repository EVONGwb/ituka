import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Settings,
  LogOut 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { can } from '../../lib/permissions';

export default function Sidebar({ logout }) {
  const location = useLocation();
  const [unreadCounts, setUnreadCounts] = useState({ chats: 0, requests: 0 });
  const { user } = useAuth();
  const role = user?.role;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Simulated endpoint or fetch real counts
        // const { data } = await api.get('/admin/notifications/counts');
        // setUnreadCounts(data);
        
        let unreadChats = 0;
        if (can(role, 'chats:read')) {
          const { data: chats } = await api.get('/chat/conversations');
          unreadChats = (Array.isArray(chats) ? chats : []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        }
        
        // Count new requests (status 'solicitud_recibida')
        let newRequests = 0;
        if (can(role, 'requests:read')) {
          const { data: requests } = await api.get('/orders/requests');
          const list = Array.isArray(requests) ? requests : [];
          newRequests = list.filter(r => r.status === 'solicitud_recibida').length;
        }

        setUnreadCounts({ chats: unreadChats, requests: newRequests });
      } catch (error) {
        console.error("Error fetching notification counts", error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [role]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', permission: 'dashboard:read' },
    { icon: TrendingUp, label: 'Analítica', path: '/admin/analytics', permission: 'analytics:read' },
    { icon: FileText, label: 'Solicitudes', path: '/admin/requests', badge: unreadCounts.requests, permission: 'requests:read' },
    { icon: MessageSquare, label: 'Chats', path: '/admin/chats', badge: unreadCounts.chats, permission: 'chats:read' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders', permission: 'orders:read' },
    { icon: Package, label: 'Productos', path: '/admin/products', permission: 'products:read' },
    { icon: Users, label: 'Clientes', path: '/admin/clients', permission: 'clients:read' },
    { icon: Settings, label: 'Ajustes', path: '/admin/settings', permission: '*' },
  ];

  return (
    <aside className="w-72 bg-ituka-surface dark:bg-[#0F172A] border-r border-ituka-border/70 dark:border-white/10 fixed h-full z-20 flex flex-col shadow-ituka-card">
      <div className="p-8 border-b border-ituka-border/70 dark:border-white/10 flex items-center justify-center">
        <img 
          src="/ituka-logo-transparent.png" 
          alt="ITUKA" 
          className="h-12 w-auto object-contain"
        />
        <span className="ml-3 font-serif font-bold text-2xl text-ituka-text dark:text-stone-100 tracking-wide">ITUKA</span>
      </div>
      
      <div className="px-6 py-8">
        <p className="px-4 text-xs font-bold text-stone-400 dark:text-stone-400 uppercase tracking-wider mb-4">Menú Principal</p>
        <nav className="space-y-2">
          {navItems.filter((i) => i.permission === '*' ? role === 'admin' : can(role, i.permission)).map((item) => {
            const isActive = item.path === '/admin/dashboard'
              ? location.pathname === '/admin' || location.pathname.startsWith('/admin/dashboard')
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-ituka-gold/10 dark:bg-white/10 text-ituka-ink dark:text-white font-bold shadow-ituka-card' 
                    : 'text-ituka-ink/55 dark:text-stone-300 hover:bg-ituka-cream-soft dark:hover:bg-white/5 hover:text-ituka-ink dark:hover:text-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-ituka-gold dark:text-white' : 'text-ituka-ink/35 dark:text-stone-400 group-hover:text-ituka-ink/60 dark:group-hover:text-stone-200'}`} strokeWidth={1.5} />
                  {item.label}
                </div>
                {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-ituka-gold text-white' : 'bg-ituka-danger text-white shadow-ituka-card'
                    }`}>
                        {item.badge}
                    </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-ituka-border/70 dark:border-white/10 bg-ituka-cream-soft dark:bg-white/5">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stone-500 dark:text-stone-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all duration-300 text-left group font-medium"
        >
          <LogOut className="w-5 h-5 text-stone-400 dark:text-stone-400 group-hover:text-red-500 transition-colors" strokeWidth={1.5} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
