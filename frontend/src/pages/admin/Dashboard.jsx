import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShoppingBag, 
  Package, 
  Users, 
  MessageSquare,
  UserPlus,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Bell,
  Search
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { StatCard, SectionHeader, ActionButton, SearchInput } from '../../components/admin/ui';
import { useAdminPreferences } from '../../context/AdminPreferencesContext';
import { formatDate } from '../../lib/adminDateFormat';
import { ITUKA_PALETTE } from '../../styles/itukaPalette';

export default function AdminDashboard() {
  const { prefs } = useAdminPreferences();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ituka-gold"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const kpiCards = [
    { label: 'Solicitudes Nuevas', value: stats.newRequests, icon: FileText, color: 'text-ituka-gold', bg: 'bg-ituka-gold/10', link: '/admin/requests', trend: 12 },
    { label: 'Pedidos Activos', value: stats.activeOrders, icon: ShoppingBag, color: 'text-ituka-gold', bg: 'bg-ituka-gold/10', link: '/admin/orders', trend: 5 },
    { label: 'Productos', value: stats.totalProducts, icon: Package, color: 'text-ituka-gold', bg: 'bg-ituka-gold/10', link: '/admin/products', trend: 0 },
    { label: 'Mensajes', value: stats.pendingMessages, icon: MessageSquare, color: 'text-ituka-gold', bg: 'bg-ituka-gold/10', link: '/admin/chats', trend: -2 },
    { label: 'Clientes', value: stats.totalClients, icon: Users, color: 'text-ituka-gold', bg: 'bg-ituka-gold/10', link: '/admin/clients', trend: 8 },
    { label: 'Ventas Mes', value: `$${stats.salesMonth}`, icon: DollarSign, color: 'text-ituka-gold', bg: 'bg-ituka-gold/10', link: '/admin/orders', trend: 15 },
  ];

  return (
    <div>
      {/* Header del Dashboard */}
      <div className="ituka-card p-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-[32px] font-serif font-bold text-ituka-text tracking-tight">Dashboard</h2>
            <p className="text-ituka-ink/55 text-base mt-1 font-light">Resumen general de tu negocio</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none md:w-72">
              <SearchInput placeholder="Buscar cliente, pedido..." />
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full text-ituka-ink/45 hover:text-ituka-gold transition-colors hover:bg-ituka-cream-soft">
                <Bell className="w-5 h-5" strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ituka-danger rounded-full border-2 border-white"></span>
              </button>

              <Link to="/admin/settings" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-ituka-cream-soft flex items-center justify-center border border-ituka-border/70 group-hover:border-ituka-gold/30 transition-colors overflow-hidden shadow-ituka-card">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fila 1: KPIs Principales (Prioridad Urgente) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          {...kpiCards[0]} 
          link="/admin/requests" 
          description="3 nuevas hoy"
        /> 
        <StatCard 
          {...kpiCards[1]} 
          link="/admin/orders" 
          description="En proceso"
        /> 
        <StatCard 
          {...kpiCards[2]} 
          link="/admin/products" 
          description="En catálogo"
        /> 
        <StatCard 
          {...kpiCards[3]} 
          link="/admin/chats" 
          description="Sin leer"
        /> 
      </div>

      {/* Fila 2: Actividad y Ventas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2 ituka-card ituka-card-hover p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-ituka-text text-xl flex items-center gap-2 font-serif">
              <Clock className="w-6 h-6 text-ituka-gold" strokeWidth={1.5} />
              Actividad Reciente
            </h3>
            <Link to="/admin/orders" className="text-sm text-ituka-green hover:text-ituka-green/80 flex items-center gap-1 font-bold transition-colors">
              Ver historial <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
          
          <div className="relative border-l-2 border-ituka-border/70 ml-3 space-y-8 pl-8 pb-2">
            {stats.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-ituka-cream-soft rounded-full flex items-center justify-center mb-3 border border-ituka-border/70">
                  <Clock className="w-6 h-6 text-ituka-ink/25" strokeWidth={1.5} />
                </div>
                <p className="text-ituka-ink/45 font-medium">No hay actividad reciente.</p>
                <p className="text-ituka-ink/40 text-xs mt-1 px-4">Las acciones que realices aparecerán aquí en orden cronológico.</p>
              </div>
            ) : (
              stats.recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-ituka-card flex items-center justify-center transition-transform group-hover:scale-110
                    ${activity.type === 'order' ? 'bg-ituka-gold' : 
                      activity.type === 'message' ? 'bg-ituka-info' : 
                      activity.type === 'client' ? 'bg-ituka-success' :
                      'bg-ituka-warning'}`}>
                  </div>
                  
                  <Link 
                    to={
                      activity.type === 'order' ? `/admin/orders?search=${activity.title.includes('#') ? activity.title.split('#')[1] : ''}` : 
                      activity.type === 'message' ? `/admin/chats` : // TODO: Need userId in activity to link deep
                      activity.type === 'client' ? `/admin/clients?search=${activity.user}` :
                      '/admin/products'
                    }
                    className="block group-hover:translate-x-1 transition-transform duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-ituka-text text-base group-hover:text-ituka-gold transition-colors">{activity.title}</p>
                        <p className="text-sm text-ituka-ink/55 mt-1">
                          <span className="font-semibold text-ituka-ink">{activity.user}</span> • {activity.description}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-ituka-ink/45 bg-ituka-cream-soft px-2 py-1 rounded-lg border border-ituka-border/70 group-hover:border-ituka-gold/20 group-hover:bg-ituka-cream transition-colors">
                        {(() => {
                            const date = new Date(activity.date);
                            const now = new Date();
                            const diff = Math.floor((now - date) / 60000); // minutos
                            if (diff < 60) return `hace ${diff} min`;
                            if (diff < 1440) return `hace ${Math.floor(diff/60)} h`;
                            return formatDate(date, prefs);
                        })()}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bloque lateral de Últimas Solicitudes (Real) */}
        <div className="ituka-card ituka-card-hover p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-ituka-gold/10 rounded-full border border-ituka-border/70 shadow-ituka-inset">
                    <FileText className="w-6 h-6 text-ituka-gold" strokeWidth={1.5} />
                 </div>
                 <h3 className="font-bold text-ituka-text text-lg font-serif">Últimas Solicitudes</h3>
               </div>
               <Link to="/admin/requests" className="text-sm font-bold text-ituka-gold hover:text-ituka-gold/90 transition-colors">
                 Ver todas
               </Link>
            </div>
            
            <div className="flex-1 space-y-4">
               {stats.lastRequests && stats.lastRequests.length > 0 ? (
                 stats.lastRequests.map((req, i) => (
                   <Link 
                     key={i} 
                     to={`/admin/requests?search=${req.id.slice(-6)}`}
                     className="flex items-center justify-between p-3 hover:bg-ituka-cream-soft rounded-xl transition-all border border-transparent hover:border-ituka-border/70 group cursor-pointer"
                   >
                     <div>
                       <p className="font-bold text-ituka-ink text-sm group-hover:text-ituka-gold transition-colors">{req.user}</p>
                       <p className="text-xs text-ituka-ink/55 mt-0.5 flex items-center gap-1">
                         <span className="font-medium text-ituka-ink-muted">{req.product}</span>
                         {req.totalItems > 1 && <span className="text-[10px] bg-ituka-cream-deep px-1.5 rounded-full text-ituka-ink/55 group-hover:bg-white transition-colors">+{req.totalItems - 1}</span>}
                       </p>
                     </div>
                     <span className="px-2 py-1 rounded-lg bg-ituka-gold/10 text-ituka-gold text-[10px] font-bold uppercase tracking-wide group-hover:bg-ituka-gold group-hover:text-white transition-all">
                       Nueva
                     </span>
                   </Link>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                   <div className="w-16 h-16 bg-ituka-cream-soft rounded-full flex items-center justify-center mb-4 border border-ituka-border/70 animate-pulse">
                     <FileText className="w-8 h-8 text-ituka-ink/25" strokeWidth={1.5} />
                   </div>
                   <p className="text-ituka-ink/55 font-bold mb-1">Aún no hay solicitudes</p>
                   <p className="text-ituka-ink/40 text-xs px-6">
                     Cuando los clientes envíen solicitudes aparecerán aquí.
                   </p>
                 </div>
               )}
            </div>
            
            <div className="mt-auto pt-6 ituka-divider text-center">
               <Link to="/admin/requests" className="ituka-btn ituka-btn-primary w-full">
                 Gestionar Solicitudes <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
               </Link>
            </div>
        </div>
      </div>

      {/* Fila 3: Analítica (Paso 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Gráfico de Solicitudes Semanales */}
        <div className="lg:col-span-2 ituka-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-ituka-text text-xl font-serif flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-ituka-gold" strokeWidth={1.5} />
              Solicitudes de la Semana
            </h3>
            <span className="text-xs font-bold text-ituka-ink/45 bg-ituka-cream-soft px-3 py-1.5 rounded-full border border-ituka-border/70">Últimos 7 días</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.requestsByDay}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ITUKA_PALETTE.gold} stopOpacity={0.18}/>
                    <stop offset="95%" stopColor={ITUKA_PALETTE.gold} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="_id" 
                  tick={{fontSize: 12, fill: ITUKA_PALETTE.stone400, fontWeight: 500}} 
                  stroke={ITUKA_PALETTE.stone200} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10} 
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    const locale = prefs.language === 'en' ? 'en-US' : 'es-ES';
                    if (Number.isNaN(d.getTime())) return '';
                    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
                  }}
                />
                <YAxis tick={{fontSize: 12, fill: ITUKA_PALETTE.stone400, fontWeight: 500}} stroke={ITUKA_PALETTE.stone200} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: `1px solid ${ITUKA_PALETTE.border}`, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '16px', backgroundColor: '#fff'}}
                  itemStyle={{color: ITUKA_PALETTE.gold, fontWeight: 'bold'}}
                  labelStyle={{color: ITUKA_PALETTE.ink, marginBottom: '4px', fontWeight: 'bold'}}
                  cursor={{stroke: ITUKA_PALETTE.stone200, strokeWidth: 2, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="count" name="Solicitudes" stroke={ITUKA_PALETTE.gold} strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 ituka-divider pt-6">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-ituka-ink/45 font-bold">Total Semana</p>
              <p className="text-2xl font-bold text-ituka-text">{stats.requestsByDay.reduce((acc, curr) => acc + curr.count, 0)}</p>
            </div>
            <div className="text-center border-l border-ituka-border/70">
              <p className="text-[10px] uppercase tracking-widest text-ituka-ink/45 font-bold">Promedio Diario</p>
              <p className="text-2xl font-bold text-ituka-text">{(stats.requestsByDay.reduce((acc, curr) => acc + curr.count, 0) / 7).toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Top Productos Más Solicitados */}
        <div className="ituka-card p-8 flex flex-col">
          <h3 className="font-bold text-ituka-text text-xl mb-8 flex items-center gap-2 font-serif">
            <Package className="w-6 h-6 text-stone-300" />
            Productos Más Solicitados
          </h3>
          <div className="flex-1 space-y-7">
            {stats.topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-stone-200" />
                </div>
                <p className="text-stone-400 text-sm italic font-light px-4">Aún no hay suficientes datos para mostrar patrones.</p>
              </div>
            ) : (
              stats.topProducts.map((prod, i) => (
                <div key={i} className="relative group">
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="font-bold text-stone-700 truncate max-w-[160px] group-hover:text-ituka-gold transition-colors">{prod.name}</span>
                    <span className="text-stone-500 font-black text-xs bg-stone-50 px-2 py-0.5 rounded-md border border-stone-100">{prod.count} unid.</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-ituka-gold h-full rounded-full transition-all duration-1000 ease-out relative" 
                      style={{ width: `${(prod.count / stats.topProducts[0].count) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 pt-6 border-t border-stone-100">
             <Link to="/admin/products" className="text-xs font-bold text-stone-400 hover:text-ituka-gold flex items-center justify-center gap-2 uppercase tracking-tighter transition-colors">
               Analizar inventario completo <ArrowRight className="w-3 h-3" />
             </Link>
          </div>
        </div>
      </div>

      {/* Fila 4: Accesos Rápidos (Paso 8) */}
      <div className="ituka-card p-8">
        <h3 className="font-bold text-ituka-text text-xl mb-8 font-serif flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-ituka-gold" />
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <Link to="/admin/products" className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl hover:bg-ituka-gold/10 hover:shadow-lg transition-all group border border-transparent hover:border-ituka-gold/20 text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-ituka-gold mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs text-stone-600 group-hover:text-ituka-gold uppercase tracking-wider">Añadir Producto</span>
          </Link>

          <Link to="/admin/requests" className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all group border border-transparent hover:border-blue-100 text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-500 mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs text-stone-600 group-hover:text-blue-600 uppercase tracking-wider">Ver Solicitudes</span>
          </Link>

          <Link to="/admin/chats" className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl hover:bg-amber-50 hover:shadow-lg transition-all group border border-transparent hover:border-amber-100 text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-amber-500 mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs text-stone-600 group-hover:text-amber-600 uppercase tracking-wider">Abrir Chats</span>
          </Link>

          <Link to="/admin/orders" className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl hover:bg-purple-50 hover:shadow-lg transition-all group border border-transparent hover:border-purple-100 text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-500 mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs text-stone-600 group-hover:text-purple-600 uppercase tracking-wider">Crear Pedido Manual</span>
          </Link>

          <Link to="/admin/clients" className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl hover:bg-teal-50 hover:shadow-lg transition-all group border border-transparent hover:border-teal-100 text-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-teal-500 mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-bold text-xs text-stone-600 group-hover:text-teal-600 uppercase tracking-wider">Ver Clientes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
