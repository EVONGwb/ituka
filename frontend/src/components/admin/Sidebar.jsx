import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function Sidebar({ logout }) {
  const location = useLocation();
  const [unreadCounts, setUnreadCounts] = useState({ chats: 0, requests: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Simulated endpoint or fetch real counts
        // const { data } = await api.get('/admin/notifications/counts');
        // setUnreadCounts(data);
        
        // For demo/prototype purposes, we can try to fetch unread chats
        const { data: chats } = await api.get('/chat/conversations');
        const unreadChats = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        
        // Count new requests (status 'solicitud_recibida')
        const { data: requests } = await api.get('/orders/requests');
        const newRequests = requests.filter(r => r.status === 'solicitud_recibida').length;

        setUnreadCounts({ chats: unreadChats, requests: newRequests });
      } catch (error) {
        console.error("Error fetching notification counts", error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Solicitudes', path: '/admin/requests', badge: unreadCounts.requests },
    { icon: MessageSquare, label: 'Chats', path: '/admin/chats', badge: unreadCounts.chats },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' },
    { icon: Package, label: 'Productos', path: '/admin/products' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' },
    { icon: Settings, label: 'Ajustes', path: '/admin/settings' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-stone-200 fixed h-full z-20 flex flex-col shadow-sm">
      <div className="p-8 border-b border-stone-100 flex items-center justify-center">
        <img 
          src="/ituka-logo-transparent.png" 
          alt="ITUKA" 
          className="h-12 w-auto object-contain"
        />
        <span className="ml-3 font-serif font-bold text-2xl text-ituka-text tracking-wide">ITUKA</span>
      </div>
      
      <div className="px-6 py-8">
        <p className="px-4 text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Menú Principal</p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#E8F5E9] text-ituka-green font-bold shadow-sm' 
                    : 'text-stone-500 hover:bg-[#F9F9F7] hover:text-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-ituka-green' : 'text-stone-400 group-hover:text-stone-600'}`} />
                  {item.label}
                </div>
                {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-ituka-green text-white' : 'bg-red-500 text-white shadow-sm'
                    }`}>
                        {item.badge}
                    </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-stone-100 bg-[#F9F9F7]">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 text-left group font-medium"
        >
          <LogOut className="w-5 h-5 text-stone-400 group-hover:text-red-500 transition-colors" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
