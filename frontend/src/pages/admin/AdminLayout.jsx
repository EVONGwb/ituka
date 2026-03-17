import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminBottomNav from '../../components/admin/AdminBottomNav';
import { isStaff } from '../../lib/permissions';
import { AdminPreferencesProvider, useAdminPreferences } from '../../context/AdminPreferencesContext';
import InitialPanelSetup from './InitialPanelSetup';

function AdminLayoutInner({ user, logout }) {
  const navigate = useNavigate();
  const { prefs, initialized, loading } = useAdminPreferences();

  useEffect(() => {
    if (loading) return;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = prefs.theme === 'system' ? (prefersDark ? 'dark' : 'light') : prefs.theme;
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.lang = prefs.language === 'en' ? 'en' : 'es';
  }, [prefs.theme, prefs.language, loading]);

  return (
    <div className="flex h-screen overflow-hidden bg-ituka-cream-soft dark:bg-[#0B0F14]">
      <div className="hidden lg:block">
        <Sidebar logout={() => { logout(); navigate('/login'); }} />
      </div>

      <div className="flex-1 flex flex-col ml-0 lg:ml-72 min-w-0 transition-all duration-300">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-12 scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-12 animate-fade-in-up">
            {!initialized ? <InitialPanelSetup /> : <Outlet />}
          </div>
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirigir si loading ha terminado explícitamente
    if (!loading) {
      if (!user) {
        // Usar replace para evitar historial sucio
        navigate('/login', { replace: true });
      } else if (!isStaff(user.role)) {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Mostrar spinner mientras carga O mientras el usuario existe pero no se ha renderizado aún
  // Esto evita el 'falso negativo' visual antes de la redirección
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-ituka-cream">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ituka-gold"></div>
    </div>
  );

  // Si no carga y no hay usuario, el useEffect de arriba se encargará.
  // Pero para seguridad de renderizado, retornamos null aquí en lugar de contenido roto
  if (!user || !isStaff(user.role)) return null;

  return (
    <AdminPreferencesProvider user={user}>
      <AdminLayoutInner user={user} logout={logout} />
    </AdminPreferencesProvider>
  );
}
