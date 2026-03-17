import { useEffect, useState } from 'react';
import { SectionHeader, ActionButton } from '../../components/admin/ui';
import { Bell, Lock, Shield, SlidersHorizontal, User } from 'lucide-react';
import { useAdminPreferences } from '../../context/AdminPreferencesContext';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { prefs, savePrefs } = useAdminPreferences();
  const [draft, setDraft] = useState(prefs);

  useEffect(() => {
    setDraft(prefs);
  }, [prefs]);

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Lock },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'team', label: 'Equipo', icon: Shield },
    { id: 'panel', label: 'Panel', icon: SlidersHorizontal },
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
          <div className="ituka-card p-2 dark:bg-[#0F172A] dark:border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm mb-1 ${
                  activeTab === tab.id 
                    ? 'bg-ituka-success-soft dark:bg-white/10 text-ituka-green dark:text-white' 
                    : 'text-ituka-muted dark:text-stone-300 hover:bg-ituka-cream-soft dark:hover:bg-white/5 hover:text-ituka-ink dark:hover:text-stone-100'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-ituka-green dark:text-white' : 'text-stone-400 dark:text-stone-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="ituka-card p-8 animate-fade-in dark:bg-[#0F172A] dark:border-white/10">
              <h3 className="text-xl font-bold text-ituka-text dark:text-stone-100 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-stone-300 dark:text-stone-400" />
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
                      <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Nombre</label>
                      <input type="text" defaultValue="Admin User" className="ituka-input dark:bg-white/5 dark:border-white/10 dark:text-stone-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Email</label>
                      <input type="email" defaultValue="admin@ituka.com" className="ituka-input dark:bg-white/5 dark:border-white/10 dark:text-stone-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Bio</label>
                    <textarea className="ituka-input h-24 resize-none dark:bg-white/5 dark:border-white/10 dark:text-stone-100" defaultValue="Administrador principal de ITUKA Store."></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 ituka-divider dark:border-white/10">
                <ActionButton variant="primary">Guardar Cambios</ActionButton>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="ituka-card p-8 animate-fade-in dark:bg-[#0F172A] dark:border-white/10">
              <h3 className="text-xl font-bold text-ituka-text dark:text-stone-100 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-stone-300 dark:text-stone-400" />
                Seguridad
              </h3>
              
              <div className="max-w-md space-y-5">
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Contraseña Actual</label>
                  <input type="password" className="ituka-input dark:bg-white/5 dark:border-white/10 dark:text-stone-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Nueva Contraseña</label>
                  <input type="password" className="ituka-input dark:bg-white/5 dark:border-white/10 dark:text-stone-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Confirmar Contraseña</label>
                  <input type="password" className="ituka-input dark:bg-white/5 dark:border-white/10 dark:text-stone-100" />
                </div>
              </div>

              <div className="flex justify-end pt-6 mt-8 ituka-divider dark:border-white/10">
                <ActionButton variant="primary">Actualizar Contraseña</ActionButton>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="ituka-card p-8 animate-fade-in dark:bg-[#0F172A] dark:border-white/10">
              <h3 className="text-xl font-bold text-ituka-text dark:text-stone-100 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-stone-300 dark:text-stone-400" />
                Preferencias de Notificación
              </h3>
              
              <div className="space-y-4">
                {['Nuevos pedidos', 'Mensajes de clientes', 'Stock bajo', 'Resumen semanal'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-ituka-border/70 dark:border-white/10 hover:bg-ituka-cream-soft dark:hover:bg-white/5 transition-colors">
                    <span className="font-medium text-stone-700 dark:text-stone-100">{item}</span>
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
             <div className="ituka-card py-16 px-8 text-center flex flex-col items-center justify-center dark:bg-[#0F172A] dark:border-white/10">
               <div className="bg-ituka-cream-soft dark:bg-white/5 p-6 rounded-full mb-4">
                 <Shield className="w-12 h-12 text-ituka-ink/25 dark:text-stone-400" />
               </div>
               <h3 className="text-lg font-bold text-ituka-ink dark:text-stone-100 mb-1">Gestión de Equipo</h3>
               <p className="text-ituka-ink/45 text-sm max-w-sm mx-auto mb-6">Próximamente podrás invitar a otros administradores y asignar roles.</p>
               <ActionButton variant="secondary">Solicitar Acceso Beta</ActionButton>
             </div>
          )}

          {activeTab === 'panel' && (
            <div className="ituka-card p-8 animate-fade-in dark:bg-[#0F172A] dark:border-white/10">
              <h3 className="text-xl font-bold text-ituka-text dark:text-stone-100 mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-6 h-6 text-stone-300 dark:text-stone-400" />
                Preferencias del panel
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Tema</label>
                  <select
                    value={draft.theme}
                    onChange={(e) => setDraft((p) => ({ ...p, theme: e.target.value }))}
                    className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
                  >
                    <option value="system">Sistema</option>
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Idioma</label>
                  <select
                    value={draft.language}
                    onChange={(e) => setDraft((p) => ({ ...p, language: e.target.value }))}
                    className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Formato de fecha</label>
                  <select
                    value={draft.dateFormat}
                    onChange={(e) => setDraft((p) => ({ ...p, dateFormat: e.target.value }))}
                    className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
                  >
                    <option value="DMY">DD/MM/AAAA</option>
                    <option value="MDY">MM/DD/AAAA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-1.5">Formato de hora</label>
                  <select
                    value={draft.timeFormat}
                    onChange={(e) => setDraft((p) => ({ ...p, timeFormat: e.target.value }))}
                    className="ituka-select dark:bg-white/5 dark:border-white/10 dark:text-stone-100"
                  >
                    <option value="24h">24h</option>
                    <option value="12h">12h</option>
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold text-stone-500 dark:text-stone-300 uppercase tracking-wide mb-3">Notificaciones del panel</p>
                <div className="space-y-3">
                  {[
                    { key: 'newOrders', label: 'Nuevos pedidos' },
                    { key: 'newMessages', label: 'Mensajes de clientes' },
                    { key: 'weeklySummary', label: 'Resumen semanal' }
                  ].map((i) => (
                    <div key={i.key} className="flex items-center justify-between p-4 rounded-xl border border-ituka-border/70 dark:border-white/10 hover:bg-ituka-cream-soft dark:hover:bg-white/5 transition-colors">
                      <span className="font-medium text-stone-700 dark:text-stone-100">{i.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(draft.panelNotifications?.[i.key])}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              panelNotifications: { ...(p.panelNotifications || {}), [i.key]: e.target.checked }
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ituka-green"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6 mt-8 border-t border-stone-100 dark:border-white/10">
                <ActionButton variant="primary" onClick={() => savePrefs(draft)}>
                  Guardar preferencias
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
