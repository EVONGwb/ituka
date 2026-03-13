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

export default function AdminDashboard() {
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a25a]"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const kpiCards = [
    { label: 'Solicitudes Nuevas', value: stats.newRequests, icon: FileText, color: 'text-ituka-green', bg: 'bg-[#E8F5E9]', link: '/admin/requests', trend: 12 },
    { label: 'Pedidos Activos', value: stats.activeOrders, icon: ShoppingBag, color: 'text-ituka-gold', bg: 'bg-[#FFF8E1]', link: '/admin/orders', trend: 5 },
    { label: 'Productos', value: stats.totalProducts, icon: Package, color: 'text-stone-600', bg: 'bg-stone-100', link: '/admin/products', trend: 0 },
    { label: 'Mensajes', value: stats.pendingMessages, icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50', link: '/admin/chats', trend: -2 },
    { label: 'Clientes', value: stats.totalClients, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', link: '/admin/clients', trend: 8 },
    { label: 'Ventas Mes', value: `$${stats.salesMonth}`, icon: DollarSign, color: 'text-ituka-green', bg: 'bg-[#E8F5E9]', link: '/admin/orders', trend: 15 },
  ];

  return (
    <div>
      {/* Header del Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-[32px] font-serif font-bold text-ituka-text tracking-tight">Dashboard</h2>
          <p className="text-stone-500 text-base mt-1 font-light">Resumen general de tu negocio</p>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="hidden md:block w-64">
            <SearchInput placeholder="Buscar cliente, pedido..." />
          </div>
          
          <div className="flex items-center gap-4 border-l border-stone-100 pl-6">
            <button className="relative p-2 text-stone-400 hover:text-ituka-green transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <Link to="/admin/settings" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200 group-hover:border-ituka-green transition-colors overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </Link>
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
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-ituka-text text-xl flex items-center gap-2 font-serif">
              <Clock className="w-6 h-6 text-ituka-gold" />
              Actividad Reciente
            </h3>
            <Link to="/admin/orders" className="text-sm text-ituka-green hover:text-ituka-green/80 flex items-center gap-1 font-bold transition-colors">
              Ver historial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="relative border-l-2 border-stone-100 ml-3 space-y-8 pl-8 pb-2">
            {stats.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-stone-300" />
                </div>
                <p className="text-stone-400 font-medium">No hay actividad reciente.</p>
                <p className="text-stone-400 text-xs mt-1 px-4">Las acciones que realices aparecerán aquí en orden cronológico.</p>
              </div>
            ) : (
              stats.recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110
                    ${activity.type === 'order' ? 'bg-ituka-gold' : 
                      activity.type === 'message' ? 'bg-blue-500' : 
                      activity.type === 'client' ? 'bg-teal-500' :
                      'bg-purple-500'}`}>
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
                        <p className="font-bold text-ituka-text text-base group-hover:text-ituka-green transition-colors">{activity.title}</p>
                        <p className="text-sm text-stone-500 mt-1">
                          <span className="font-semibold text-stone-700">{activity.user}</span> • {activity.description}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-stone-400 bg-stone-50 px-2 py-1 rounded-lg group-hover:bg-stone-100 transition-colors">
                        {(() => {
                            const date = new Date(activity.date);
                            const now = new Date();
                            const diff = Math.floor((now - date) / 60000); // minutos
                            if (diff < 60) return `hace ${diff} min`;
                            if (diff < 1440) return `hace ${Math.floor(diff/60)} h`;
                            return date.toLocaleDateString();
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
        <div className="bg-white p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-ituka-green/10 rounded-full">
                    <FileText className="w-6 h-6 text-ituka-green" />
                 </div>
                 <h3 className="font-bold text-ituka-text text-lg font-serif">Últimas Solicitudes</h3>
               </div>
               <Link to="/admin/requests" className="text-sm font-bold text-ituka-green hover:underline">
                 Ver todas
               </Link>
            </div>
            
            <div className="flex-1 space-y-4">
               {stats.lastRequests && stats.lastRequests.length > 0 ? (
                 stats.lastRequests.map((req, i) => (
                   <Link 
                     key={i} 
                     to={`/admin/requests?search=${req.id.slice(-6)}`}
                     className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-all border border-transparent hover:border-stone-100 group cursor-pointer"
                   >
                     <div>
                       <p className="font-bold text-stone-700 text-sm group-hover:text-ituka-text">{req.user}</p>
                       <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                         <span className="font-medium text-stone-600">{req.product}</span>
                         {req.totalItems > 1 && <span className="text-[10px] bg-stone-100 px-1.5 rounded-full text-stone-500 group-hover:bg-white transition-colors">+{req.totalItems - 1}</span>}
                       </p>
                     </div>
                     <span className="px-2 py-1 rounded-lg bg-ituka-gold/10 text-ituka-gold text-[10px] font-bold uppercase tracking-wide group-hover:bg-ituka-gold group-hover:text-white transition-all">
                       Nueva
                     </span>
                   </Link>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                   <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                     <FileText className="w-8 h-8 text-stone-300" />
                   </div>
                   <p className="text-stone-500 font-bold mb-1">Aún no hay solicitudes</p>
                   <p className="text-stone-400 text-xs px-6">
                     Cuando los clientes envíen solicitudes aparecerán aquí.
                   </p>
                 </div>
               )}
            </div>
            
            <div className="mt-auto pt-6 border-t border-stone-100 text-center">
               <Link to="/admin/requests" className="inline-flex items-center gap-2 px-4 py-2 bg-ituka-green text-white rounded-xl text-sm font-bold hover:bg-ituka-green/90 hover:shadow-lg hover:-translate-y-0.5 transition-all w-full justify-center shadow-md shadow-ituka-green/20">
                 Gestionar Solicitudes <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
        </div>
      </div>

      {/* Fila 3: Analítica (Paso 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Gráfico de Solicitudes Semanales */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-ituka-text text-xl font-serif flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-ituka-green" />
              Solicitudes de la Semana
            </h3>
            <span className="text-xs font-bold text-stone-400 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">Últimos 7 días</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.requestsByDay}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a25a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#c5a25a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="_id" 
                  tick={{fontSize: 12, fill: '#78716c', fontWeight: 500}} 
                  stroke="#E7E5E4" 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10} 
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return d.toLocaleDateString('es-ES', { weekday: 'short' });
                  }}
                />
                <YAxis tick={{fontSize: 12, fill: '#78716c', fontWeight: 500}} stroke="#E7E5E4" axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '16px', backgroundColor: '#fff'}}
                  itemStyle={{color: '#c5a25a', fontWeight: 'bold'}}
                  labelStyle={{color: '#44403c', marginBottom: '4px', fontWeight: 'bold'}}
                  cursor={{stroke: '#e7e5e4', strokeWidth: 2, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="count" name="Solicitudes" stroke="#c5a25a" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-100 pt-6">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Total Semana</p>
              <p className="text-2xl font-bold text-ituka-text">{stats.requestsByDay.reduce((acc, curr) => acc + curr.count, 0)}</p>
            </div>
            <div className="text-center border-l border-stone-100">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Promedio Diario</p>
              <p className="text-2xl font-bold text-ituka-text">{(stats.requestsByDay.reduce((acc, curr) => acc + curr.count, 0) / 7).toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Top Productos Más Solicitados */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-stone-100 flex flex-col">
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
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-stone-100">
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
