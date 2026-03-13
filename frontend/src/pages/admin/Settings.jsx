import { useState } from 'react';
import { SectionHeader, ActionButton } from '../../components/admin/ui';
import { User, Lock, Bell, Shield, LogOut } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Lock },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'team', label: 'Equipo', icon: Shield },
  ];

  return (
    <div>
      <SectionHeader 
        title="Ajustes" 
        description="Gestiona tu cuenta y configuración de la plataforma"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Ajustes */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-[24px] border border-stone-200 p-2 shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm mb-1 ${
                  activeTab === tab.id 
                    ? 'bg-[#E8F5E9] text-ituka-green' 
                    : 'text-stone-500 hover:bg-[#F9F9F7] hover:text-stone-700'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-ituka-green' : 'text-stone-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-[24px] border border-stone-200 shadow-sm animate-fade-in">
              <h3 className="text-xl font-bold text-ituka-text mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-stone-300" />
                Información Personal
              </h3>
              
              <div className="flex items-start gap-8 mb-8">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center text-3xl font-serif font-bold text-stone-400 border-4 border-white shadow-sm overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Cambiar</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4 max-w-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Nombre</label>
                      <input type="text" defaultValue="Admin User" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#F9F9F7] focus:outline-none focus:border-ituka-green" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Email</label>
                      <input type="email" defaultValue="admin@ituka.com" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#F9F9F7] focus:outline-none focus:border-ituka-green" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Bio</label>
                    <textarea className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#F9F9F7] focus:outline-none focus:border-ituka-green h-24 resize-none" defaultValue="Administrador principal de ITUKA Store."></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-stone-100">
                <ActionButton variant="primary">Guardar Cambios</ActionButton>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-[24px] border border-stone-200 shadow-sm animate-fade-in">
              <h3 className="text-xl font-bold text-ituka-text mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-stone-300" />
                Seguridad
              </h3>
              
              <div className="max-w-md space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Contraseña Actual</label>
                  <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#F9F9F7] focus:outline-none focus:border-ituka-green" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Nueva Contraseña</label>
                  <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#F9F9F7] focus:outline-none focus:border-ituka-green" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">Confirmar Contraseña</label>
                  <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#F9F9F7] focus:outline-none focus:border-ituka-green" />
                </div>
              </div>

              <div className="flex justify-end pt-6 mt-8 border-t border-stone-100">
                <ActionButton variant="primary">Actualizar Contraseña</ActionButton>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white p-8 rounded-[24px] border border-stone-200 shadow-sm animate-fade-in">
              <h3 className="text-xl font-bold text-ituka-text mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-stone-300" />
                Preferencias de Notificación
              </h3>
              
              <div className="space-y-4">
                {['Nuevos pedidos', 'Mensajes de clientes', 'Stock bajo', 'Resumen semanal'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-stone-100 hover:bg-[#F9F9F7] transition-colors">
                    <span className="font-medium text-stone-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ituka-green"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'team' && (
             <div className="text-center py-16 bg-white rounded-[24px] border border-stone-200 flex flex-col items-center justify-center">
               <div className="bg-stone-50 p-6 rounded-full mb-4">
                 <Shield className="w-12 h-12 text-stone-300" />
               </div>
               <h3 className="text-lg font-bold text-stone-600 mb-1">Gestión de Equipo</h3>
               <p className="text-stone-400 text-sm max-w-sm mx-auto mb-6">Próximamente podrás invitar a otros administradores y asignar roles.</p>
               <ActionButton variant="secondary">Solicitar Acceso Beta</ActionButton>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}