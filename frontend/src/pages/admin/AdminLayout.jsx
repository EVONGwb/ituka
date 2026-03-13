import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Solo redirigir si loading ha terminado explícitamente
    if (!loading) {
      if (!user) {
        // Usar replace para evitar historial sucio
        navigate('/login', { replace: true });
      } else if (user.role !== 'admin') {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Mostrar spinner mientras carga O mientras el usuario existe pero no se ha renderizado aún
  // Esto evita el 'falso negativo' visual antes de la redirección
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f3ec]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a25a]"></div>
    </div>
  );

  // Si no carga y no hay usuario, el useEffect de arriba se encargará.
  // Pero para seguridad de renderizado, retornamos null aquí en lugar de contenido roto
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F9F7]"> {/* Fondo Crema Claro / Stone muy suave */}
      {/* Sidebar */}
      <Sidebar logout={() => { logout(); navigate('/login'); }} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-72 min-w-0 transition-all duration-300">
        {/* Header - Eliminado para estilo más limpio tipo Notion/Linear, sidebar es suficiente */}
        {/* <Header user={user} /> */}

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-12 scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-12 animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
