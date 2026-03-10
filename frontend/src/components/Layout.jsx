import { LucideLayoutDashboard, ShoppingBag, ShoppingCart, MessageSquare, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-800 tracking-tight flex items-center gap-2">
            🌿 ITUKA
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-stone-600 hover:text-green-700 font-medium">Productos</Link>
            <Link to="/about" className="text-stone-600 hover:text-green-700 font-medium">Nosotros</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                <LucideLayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="p-2 hover:bg-stone-100 rounded-full relative">
              <ShoppingCart className="w-5 h-5 text-stone-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
                <span className="text-sm font-medium text-stone-700 hidden sm:block">Hola, {user.name}</span>
                <button 
                  onClick={logout}
                  className="text-stone-500 hover:text-red-600"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-stone-600 hover:text-green-700 font-medium">
                <User className="w-5 h-5" />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ITUKA</h3>
            <p>Cuidado natural para tu piel, con ingredientes 100% orgánicos y sostenibles.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="hover:text-white">Catálogo</Link></li>
              <li><Link to="/cart" className="hover:text-white">Mi Cesta</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin" className="hover:text-white">Panel Admin</Link></li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
            <p>hola@ituka.com</p>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-stone-800">
          <p>© 2024 ITUKA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
