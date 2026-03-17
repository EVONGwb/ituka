import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { MessageSquare, Check, X, FileText, Search, Filter, Calendar, Send, ShoppingBag } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { SectionHeader, SearchInput, StatusBadge, EmptyState, ActionButton } from '../../components/admin/ui';
import AdminChatWidget from '../../components/admin/chat/AdminChatWidget';
import { useAdminPreferences } from '../../context/AdminPreferencesContext';
import { formatDate, formatDateTime } from '../../lib/adminDateFormat';

export default function AdminRequests() {
  const navigate = useNavigate();
  const { prefs } = useAdminPreferences();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState('solicitud_recibida'); // Default to new requests
  const [filterDate, setFilterDate] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async (shouldAutoSelect = false) => {
    try {
      const { data } = await api.get('/orders/requests');
      setRequests(data);
      
      // Auto-select logic for speed
      if (shouldAutoSelect || (data.length > 0 && !selectedRequest)) {
          // If we just processed one, try to select the next one in the list
          // Or just the first one if we are in a filtered view
          const nextRequest = data.find(r => r.status === filterStatus) || data[0];
          if (nextRequest) {
              setSelectedRequest(nextRequest);
          } else {
              setSelectedRequest(null);
          }
      } else if (selectedRequest) {
          // Verify if selected request still exists in data, if not (e.g. status changed and we are filtering), select next
          const stillExists = data.find(r => r._id === selectedRequest._id);
          if (!stillExists) {
               const nextRequest = data.find(r => r.status === filterStatus) || data[0];
               setSelectedRequest(nextRequest || null);
          } else {
              // Update the selected request object with new data
              setSelectedRequest(stillExists);
          }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const actionText = status === 'confirmado' ? 'aceptar esta solicitud' : 
                       status === 'cancelado' ? 'rechazar esta solicitud' : `cambiar estado a ${status}`;
                       
    // Simple confirm is fast enough for critical actions
    if (!window.confirm(`¿${actionText}?`)) return;
    
    try {
      await api.put(`/orders/${id}/status`, { status });
      
      // Speed optimization: Don't ask to navigate, just show feedback and move to next
      // if (status === 'confirmado') { ... } // Removed for speed
      
      // Fetch and trigger auto-select of next item
      fetchRequests(true);
      
    } catch (error) {
      console.error(error);
      alert('Error al actualizar estado');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.items.some(item => item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro de Estado: 'all' muestra todo, sino coincidencia exacta
    // Mapeo de estados visuales a estados de DB si es necesario, aquí asumimos directo
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;

    // Filtro de Fecha
    let matchesDate = true;
    if (filterDate === 'today') {
      const today = new Date().toDateString();
      matchesDate = new Date(req.createdAt).toDateString() === today;
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(req.createdAt) >= weekAgo;
    } else if (filterDate === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(req.createdAt) >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="h-[calc(100vh-100px-5rem)] lg:h-[calc(100vh-100px)] flex flex-col bg-ituka-cream-soft">
      {/* ZONA 1: ENCABEZADO GLOBAL + ZONA 2: FILTROS INTEGRADOS */}
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-serif text-ituka-text tracking-tight">Solicitudes</h1>
            <p className="text-ituka-ink/55 text-sm mt-1">Gestiona y convierte las peticiones de clientes</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="w-72">
               <SearchInput 
                   value={searchTerm} 
                   onChange={(e) => setSearchTerm(e.target.value)} 
                   placeholder="Buscar cliente, producto..." 
                   className="shadow-ituka-card"
               />
            </div>
          </div>
        </div>

        {/* BARRA DE FILTROS SECUNDARIA (Estilo Pill Moderno) */}
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
           {/* Filtro de Estado */}
           <div className="flex items-center gap-1 p-1.5 bg-white border border-ituka-border/70 rounded-2xl shadow-ituka-card">
              {[
                  { id: 'solicitud_recibida', label: 'Nuevas' },
                  { id: 'en_conversacion', label: 'En Conversación' },
                  { id: 'confirmado', label: 'Confirmadas' },
                  { id: 'cancelado', label: 'Rechazadas' },
                  { id: 'all', label: 'Todas' }
              ].map(tab => (
                  <button
                      key={tab.id}
                      onClick={() => setFilterStatus(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                          filterStatus === tab.id 
                          ? 'bg-ituka-ink text-white shadow-ituka-card transform scale-105' 
                          : 'text-ituka-muted hover:bg-ituka-cream-soft hover:text-ituka-ink'
                      }`}
                  >
                      {tab.label}
                  </button>
              ))}
           </div>

           {/* Filtro de Fecha */}
           <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ituka-ink/35 pointer-events-none" />
              <select 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-10 py-2.5 bg-white border border-ituka-border/70 rounded-2xl text-xs font-bold text-ituka-ink-muted focus:outline-none focus:border-ituka-gold/50 appearance-none shadow-ituka-card cursor-pointer hover:border-ituka-border/60 transition-all h-[42px]"
              >
                  <option value="all">Cualquier fecha</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
              </select>
           </div>
        </div>
      </div>

      <div className="flex flex-1 gap-8 overflow-hidden pb-4">
        {/* PANEL IZQUIERDO: LISTA DE SOLICITUDES */}
        <div className="w-1/3 flex flex-col ituka-panel overflow-hidden">
            {/* Header de Lista */}
            <div className="px-6 py-5 border-b border-ituka-border/60 bg-white flex justify-between items-center sticky top-0 z-10">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    {filteredRequests.length} {filteredRequests.length === 1 ? 'Solicitud' : 'Solicitudes'}
                </span>
            </div>

            {/* ZONA 3: LISTA SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {loading && <div className="text-center py-12 text-stone-400 text-sm animate-pulse">Cargando...</div>}
                {!loading && filteredRequests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <FileText className="w-8 h-8 text-stone-300" />
                        </div>
                        <p className="text-stone-600 font-bold mb-2 text-lg">Aún no hay solicitudes</p>
                        <p className="text-stone-400 text-sm leading-relaxed max-w-[200px] mx-auto">
                            Cuando los clientes soliciten productos aparecerán aquí automáticamente.
                        </p>
                    </div>
                )}
                {filteredRequests.map(req => (
                    <div 
                        key={req._id}
                        onClick={() => setSelectedRequest(req)}
                        className={`p-5 rounded-ituka-card cursor-pointer transition-all duration-300 border border-transparent group relative ${
                            selectedRequest?._id === req._id 
                            ? 'bg-ituka-cream border-ituka-gold/20 shadow-ituka-float transform scale-[1.02]' 
                            : 'bg-white hover:bg-ituka-cream-soft hover:border-ituka-border/70 hover:shadow-ituka-card'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-serif transition-colors ${
                                    selectedRequest?._id === req._id ? 'bg-ituka-ink text-ituka-gold' : 'bg-ituka-cream-soft text-ituka-ink/60'
                                }`}>
                                    {req.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm leading-tight transition-colors ${
                                        selectedRequest?._id === req._id ? 'text-ituka-ink' : 'text-ituka-ink'
                                    }`}>{req.user?.name}</p>
                                    <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                                        {(() => {
                                            const date = new Date(req.createdAt);
                                            const today = new Date();
                                            if (date.toDateString() === today.toDateString()) return 'Hoy';
                                            return formatDate(date, prefs);
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <StatusBadge status={req.status} size="xs" />
                        </div>
                        
                        <div className="pl-14 pr-2">
                            <p className="text-xs text-stone-600 font-medium truncate mb-1.5">
                                {req.items[0]?.product?.name || 'Producto desconocido'}
                                {req.items.length > 1 && <span className="text-stone-400 font-normal ml-1">+{req.items.length - 1} más</span>}
                            </p>
                            <p className="text-sm font-bold text-ituka-text font-serif">${req.total}</p>
                        </div>

                        {/* ZONA 4: ACCIONES RÁPIDAS (Hover) */}
                        <div className="absolute right-3 bottom-3 hidden group-hover:flex gap-1.5 bg-white p-1.5 rounded-xl shadow-ituka-float border border-ituka-border/70 z-10 animate-in fade-in zoom-in duration-200">
                             <Link 
                                 to={`/admin/chats/${req.user?._id}`}
                                 onClick={(e) => e.stopPropagation()}
                                 className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                 title="Abrir Chat"
                             >
                                 <MessageSquare className="w-4 h-4" />
                             </Link>
                             
                             <Link 
                                 to={`/admin/clients?search=${req.user?.name}`}
                                 onClick={(e) => e.stopPropagation()}
                                 className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg transition-colors"
                                 title="Ver Cliente"
                             >
                                 <FileText className="w-4 h-4" />
                             </Link>

                             {req.status !== 'confirmado' && req.status !== 'cancelado' && (
                                <>
                                    <div className="w-px h-4 bg-stone-100 my-auto mx-1"></div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); updateStatus(req._id, 'confirmado'); }}
                                        className="p-2 text-ituka-green hover:bg-green-50 rounded-lg transition-colors"
                                        title="Convertir en Pedido"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); updateStatus(req._id, 'cancelado'); }}
                                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Rechazar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* PANEL DERECHO: DETALLE Y ACCIONES */}
        <div className="w-2/3 ituka-panel overflow-hidden flex flex-col relative">
            {selectedRequest ? (
                <>
                    {/* Header del Detalle */}
                    <div className="px-8 py-6 border-b border-stone-50 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-ituka-cream-soft flex items-center justify-center text-ituka-gold font-serif font-bold text-2xl border border-ituka-border/70 shadow-ituka-card">
                                {selectedRequest.user?.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="font-bold text-2xl text-ituka-text font-serif">{selectedRequest.user?.name}</h2>
                                <p className="text-sm text-stone-400 flex items-center gap-2 mt-0.5">
                                    {selectedRequest.user?.email} 
                                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                                    #{selectedRequest._id.slice(-6).toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {selectedRequest.status !== 'confirmado' && selectedRequest.status !== 'cancelado' && (
                                <>
                                    <button 
                                        onClick={() => updateStatus(selectedRequest._id, 'cancelado')}
                                        className="px-5 py-2.5 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-bold flex items-center gap-2 border border-transparent hover:border-red-100"
                                    >
                                        <X className="w-4 h-4" /> Rechazar
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(selectedRequest._id, 'confirmado')}
                                        className="px-6 py-2.5 rounded-xl bg-ituka-green text-white hover:bg-ituka-green/90 shadow-lg shadow-ituka-green/20 transition-all hover:-translate-y-0.5 text-sm font-bold flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Convertir en Pedido
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Contenido del Detalle */}
                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
                        <div className="space-y-8 pr-2">
                            {/* Estado Actual */}
                            <div className="p-5 rounded-2xl bg-ituka-cream-soft/60 border border-ituka-border/70 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Estado Actual</p>
                                    <StatusBadge status={selectedRequest.status} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Fecha Solicitud</p>
                                    <p className="font-bold text-stone-600 text-sm">{formatDateTime(selectedRequest.createdAt, prefs)}</p>
                                </div>
                            </div>

                            {/* Notas */}
                            {selectedRequest.note && (
                                <div>
                                    <h3 className="font-bold text-xs text-stone-400 uppercase tracking-widest mb-3">Nota del Cliente</h3>
                                    <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 text-amber-900/80 italic text-sm leading-relaxed">
                                        "{selectedRequest.note}"
                                    </div>
                                </div>
                            )}

                            {/* Productos */}
                            <div>
                                <h3 className="font-bold text-lg text-ituka-text mb-5 flex items-center gap-2 font-serif">
                                    <ShoppingBag className="w-5 h-5 text-ituka-gold" />
                                    Productos Solicitados
                                </h3>
                                <div className="space-y-4">
                                    {selectedRequest.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-ituka-border/70 hover:border-ituka-gold/20 hover:bg-ituka-cream transition-all bg-white shadow-ituka-card hover:shadow-ituka-float">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden border border-stone-50">
                                                    {item.product?.images?.[0] ? (
                                                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="w-6 h-6 text-stone-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-800 text-sm mb-0.5">{item.product?.name}</p>
                                                    <p className="text-xs text-stone-500 font-medium">${item.price} c/u</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-stone-800 text-sm">x{item.quantity}</p>
                                                <p className="font-bold text-ituka-green text-sm">${item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-end pt-6 ituka-divider mt-6">
                                        <div className="text-right">
                                            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-1">Total Estimado</p>
                                            <p className="text-3xl font-serif font-bold text-ituka-text">${selectedRequest.total}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: CHAT INTEGRADO (Paso 9) */}
                        <div className="bg-ituka-cream-soft rounded-ituka-card border border-ituka-border/70 overflow-hidden flex flex-col h-[600px] lg:h-auto shadow-ituka-inset relative">
                            <div className="px-5 py-4 bg-white border-b border-ituka-border/60 flex justify-between items-center z-10 shadow-ituka-card">
                                <h3 className="font-bold text-stone-700 flex items-center gap-2 text-sm">
                                    <MessageSquare className="w-4 h-4 text-ituka-gold" />
                                    Conversación con {selectedRequest.user?.name.split(' ')[0]}
                                </h3>
                                <span className="text-[10px] text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 border border-green-100">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span> En línea
                                </span>
                            </div>
                            
                            <div className="flex-1 relative">
                                <AdminChatWidget 
                                    userId={selectedRequest.user?._id} 
                                    userName={selectedRequest.user?.name}
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState 
                    icon={FileText}
                    title="Selecciona una solicitud"
                    description="Haz clic en una solicitud de la lista izquierda para ver sus detalles y comenzar a gestionarla."
                />
            )}
        </div>
      </div>
    </div>
  );
}
