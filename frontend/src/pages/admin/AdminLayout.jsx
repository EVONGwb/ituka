import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== 'admin') return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Productos', path: '/admin/products' },
    { icon: FileText, label: 'Solicitudes', path: '/admin/requests' },
    { icon: MessageSquare, label: 'Chats', path: '/admin/chats' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 fixed h-full z-10 flex flex-col">
        <div className="p-6 border-b border-stone-100">
          <h1 className="text-xl font-bold text-green-800 tracking-tight">ITUKA ADMIN</h1>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-green-50 text-green-700 font-medium' 
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-stone-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
