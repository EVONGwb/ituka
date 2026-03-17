import { LucideLayoutDashboard, ShoppingBag, ShoppingCart, MessageSquare, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isLinkActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-ituka-cream text-ituka-ink font-sans flex flex-col">
      {/* Header */}
      <header className="bg-ituka-cream/90 backdrop-blur-md border-b border-ituka-gold/20 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-3xl font-serif font-bold text-ituka-ink tracking-wider flex items-center gap-2">
            <span className="text-ituka-green">ITUKA</span>
            <span className="text-xs font-sans font-light tracking-[0.2em] uppercase mt-1 hidden sm:block text-ituka-ink-muted">Skin Care</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium uppercase tracking-widest hover:text-ituka-gold transition-colors ${isLinkActive('/dashboard') ? 'text-ituka-gold' : 'text-ituka-ink'}`}
            >
              Inicio
            </Link>
            <Link 
              to="/products" 
              className={`text-sm font-medium uppercase tracking-widest hover:text-ituka-gold transition-colors ${isLinkActive('/products') ? 'text-ituka-gold' : 'text-ituka-ink'}`}
            >
              Catálogo
            </Link>
            <Link 
              to="/chat" 
              className={`text-sm font-medium uppercase tracking-widest hover:text-ituka-gold transition-colors ${isLinkActive('/chat') ? 'text-ituka-gold' : 'text-ituka-ink'}`}
            >
              Ayuda
            </Link>
             {user?.role && user.role !== 'customer' && (
              <Link to="/admin" className="text-ituka-gold hover:text-ituka-gold/90 font-medium flex items-center gap-1">
                <LucideLayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </nav>

          {/* Icons Area */}
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-ituka-ink group-hover:text-ituka-gold transition-colors" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-ituka-gold text-white text-[10px] rounded-full flex items-center justify-center">0</span>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-ituka-gold/30">
                <Link to="/profile" className="flex items-center gap-2 group">
                   <div className="w-8 h-8 rounded-full border border-ituka-gold p-0.5 group-hover:border-ituka-green transition-colors">
                     <div className="w-full h-full bg-ituka-cream-deep rounded-full flex items-center justify-center text-ituka-ink font-serif font-bold text-xs">
                        {user.name?.charAt(0).toUpperCase()}
                     </div>
                   </div>
                </Link>
                <button 
                  onClick={logout}
                  className="text-ituka-ink/60 hover:text-ituka-gold transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium uppercase tracking-widest text-ituka-ink hover:text-ituka-gold">
                  Entrar
                </Link>
                <Link to="/register" className="px-5 py-2 bg-ituka-gold text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-ituka-gold/90 transition-colors">
                  Únete
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-ituka-ink"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-ituka-cream border-t border-ituka-gold/20 p-4 absolute w-full left-0 shadow-lg">
            <nav className="flex flex-col gap-4">
              <Link to="/dashboard" className="text-ituka-ink font-serif text-lg">Inicio</Link>
              <Link to="/products" className="text-ituka-ink font-serif text-lg">Catálogo</Link>
              <Link to="/cart" className="text-ituka-ink font-serif text-lg">Cesta</Link>
              <Link to="/profile" className="text-ituka-ink font-serif text-lg">Mi Perfil</Link>
              {!user && (
                 <>
                  <Link to="/login" className="text-ituka-ink font-serif text-lg">Entrar</Link>
                  <Link to="/register" className="text-ituka-gold font-serif text-lg font-bold">Registrarse</Link>
                 </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-ituka-ink text-ituka-cream py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-serif font-bold mb-6 text-ituka-gold">ITUKA</h3>
            <p className="text-ituka-cream/80 font-light leading-relaxed max-w-sm">
              Redescubre tu belleza natural con ingredientes puros y sostenibles. 
              Inspirado en la riqueza de la naturaleza africana para el cuidado de tu piel.
            </p>
          </div>
          
          <div>
            <h4 className="text-ituka-gold font-serif font-bold mb-6 uppercase tracking-widest text-sm">Explorar</h4>
            <ul className="space-y-4 text-sm font-light text-ituka-cream/80">
              <li><Link to="/products" className="hover:text-ituka-gold transition-colors">Colección Completa</Link></li>
              <li><Link to="/about" className="hover:text-ituka-gold transition-colors">Nuestra Historia</Link></li>
              <li><Link to="/ingredients" className="hover:text-ituka-gold transition-colors">Ingredientes</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ituka-gold font-serif font-bold mb-6 uppercase tracking-widest text-sm">Ayuda</h4>
            <ul className="space-y-4 text-sm font-light text-ituka-cream/80">
              <li><Link to="/faq" className="hover:text-ituka-gold transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/shipping" className="hover:text-ituka-gold transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/contact" className="hover:text-ituka-gold transition-colors">Contáctanos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ituka-cream/10 mt-16 pt-8 text-center text-xs text-ituka-cream/40 uppercase tracking-widest">
          © 2026 ITUKA Skin Care. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
