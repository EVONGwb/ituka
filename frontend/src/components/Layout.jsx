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
    <div className="min-h-screen bg-[#F5F5DC] text-[#3E2723] font-sans flex flex-col">
      {/* Header */}
      <header className="bg-[#F5F5DC]/90 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-3xl font-serif font-bold text-[#3E2723] tracking-wider flex items-center gap-2">
            <span className="text-[#556B2F]">ITUKA</span>
            <span className="text-xs font-sans font-light tracking-[0.2em] uppercase mt-1 hidden sm:block text-[#5D4037]">Skin Care</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${isLinkActive('/dashboard') ? 'text-[#D4AF37]' : 'text-[#3E2723]'}`}
            >
              Inicio
            </Link>
            <Link 
              to="/products" 
              className={`text-sm font-medium uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${isLinkActive('/products') ? 'text-[#D4AF37]' : 'text-[#3E2723]'}`}
            >
              Catálogo
            </Link>
            <Link 
              to="/chat" 
              className={`text-sm font-medium uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${isLinkActive('/chat') ? 'text-[#D4AF37]' : 'text-[#3E2723]'}`}
            >
              Ayuda
            </Link>
             {user?.role === 'admin' && (
              <Link to="/admin" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                <LucideLayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </nav>

          {/* Icons Area */}
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-[#3E2723] group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#556B2F] text-white text-[10px] rounded-full flex items-center justify-center">0</span>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-[#D4AF37]/30">
                <Link to="/profile" className="flex items-center gap-2 group">
                   <div className="w-8 h-8 rounded-full border border-[#D4AF37] p-0.5 group-hover:border-[#556B2F] transition-colors">
                     <div className="w-full h-full bg-[#EBE5CE] rounded-full flex items-center justify-center text-[#3E2723] font-serif font-bold text-xs">
                        {user.name?.charAt(0).toUpperCase()}
                     </div>
                   </div>
                </Link>
                <button 
                  onClick={logout}
                  className="text-[#3E2723]/60 hover:text-[#D4AF37] transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37]">
                  Entrar
                </Link>
                <Link to="/register" className="px-5 py-2 bg-[#3E2723] text-[#F5F5DC] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#556B2F] transition-colors">
                  Únete
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#3E2723]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#F5F5DC] border-t border-[#D4AF37]/20 p-4 absolute w-full left-0 shadow-lg">
            <nav className="flex flex-col gap-4">
              <Link to="/dashboard" className="text-[#3E2723] font-serif text-lg">Inicio</Link>
              <Link to="/products" className="text-[#3E2723] font-serif text-lg">Catálogo</Link>
              <Link to="/cart" className="text-[#3E2723] font-serif text-lg">Cesta</Link>
              <Link to="/profile" className="text-[#3E2723] font-serif text-lg">Mi Perfil</Link>
              {!user && (
                 <>
                  <Link to="/login" className="text-[#3E2723] font-serif text-lg">Entrar</Link>
                  <Link to="/register" className="text-[#556B2F] font-serif text-lg font-bold">Registrarse</Link>
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
      <footer className="bg-[#3E2723] text-[#F5F5DC] py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-serif font-bold mb-6 text-[#D4AF37]">ITUKA</h3>
            <p className="text-[#F5F5DC]/80 font-light leading-relaxed max-w-sm">
              Redescubre tu belleza natural con ingredientes puros y sostenibles. 
              Inspirado en la riqueza de la naturaleza africana para el cuidado de tu piel.
            </p>
          </div>
          
          <div>
            <h4 className="text-[#D4AF37] font-serif font-bold mb-6 uppercase tracking-widest text-sm">Explorar</h4>
            <ul className="space-y-4 text-sm font-light text-[#F5F5DC]/80">
              <li><Link to="/products" className="hover:text-[#D4AF37] transition-colors">Colección Completa</Link></li>
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">Nuestra Historia</Link></li>
              <li><Link to="/ingredients" className="hover:text-[#D4AF37] transition-colors">Ingredientes</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[#D4AF37] font-serif font-bold mb-6 uppercase tracking-widest text-sm">Ayuda</h4>
            <ul className="space-y-4 text-sm font-light text-[#F5F5DC]/80">
              <li><Link to="/faq" className="hover:text-[#D4AF37] transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/shipping" className="hover:text-[#D4AF37] transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contáctanos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#F5F5DC]/10 mt-16 pt-8 text-center text-xs text-[#F5F5DC]/40 uppercase tracking-widest">
          © 2026 ITUKA Skin Care. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
