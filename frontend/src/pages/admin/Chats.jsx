import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { MessageSquare, Search, Filter, Clock, CheckCheck, User, MoreVertical, ShoppingBag, ArrowRight } from 'lucide-react';
import { SearchInput, EmptyState, StatusBadge } from '../../components/admin/ui';
import AdminChatWidget from '../../components/admin/chat/AdminChatWidget';

export default function AdminChats() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, unread
  const [relatedRequest, setRelatedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(true);

  // ... (fetchConversations logic remains similar)
  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch related request when user changes
  useEffect(() => {
      if (userId) {
          fetchRelatedRequest();
      }
  }, [userId]);

  const fetchRelatedRequest = async () => {
      try {
          const { data } = await api.get(`/orders/requests?userId=${userId}&limit=1`);
          if (data && data.length > 0) {
              setRelatedRequest(data[0]);
          } else {
              setRelatedRequest(null);
          }
      } catch (error) {
          console.error("Error fetching related request:", error);
      }
  };

  const updateRequestStatus = async (id, status) => {
    if (!window.confirm(`¿Seguro que quieres ${status === 'confirmado' ? 'aceptar y convertir' : 'rechazar'} esta solicitud ahora mismo?`)) return;
    
    try {
        await api.put(`/orders/${id}/status`, { status });
        // Refresh request data to show new status
        fetchRelatedRequest();
    } catch (error) {
        console.error("Error updating request status:", error);
        alert("Error al actualizar la solicitud");
    }
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'unread') return matchesSearch && c.unreadCount > 0;
    return matchesSearch;
  });

  const selectedConversation = conversations.find(c => c.user._id === userId);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-[#F9F9F7]">
      {/* 1. ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-ituka-text tracking-tight">Centro de Mensajes</h1>
          <p className="text-stone-500 text-sm mt-1">Conversaciones y gestión rápida de pedidos</p>
        </div>
        
        {/* Filtros Rápidos */}
        <div className="flex items-center gap-1 p-1 bg-white border border-stone-100 rounded-2xl shadow-sm">
            {[
                { id: 'all', label: 'Todos' },
                { id: 'unread', label: 'No leídos' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        filterType === tab.id 
                        ? 'bg-ituka-text text-white shadow-md' 
                        : 'text-stone-500 hover:bg-stone-50'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* 2. ÁREA DE TRABAJO UNIFICADA (Estilo WhatsApp Web/Slack) */}
      <div className="flex-1 bg-white rounded-[24px] border border-stone-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden flex mx-1 mb-4">
        
        {/* A. LISTA DE CHATS (Columna Izquierda) */}
        <div className="w-80 flex flex-col border-r border-stone-100 bg-[#FAFAF9]">
            <div className="p-4 border-b border-stone-100 bg-white">
                <SearchInput 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Buscar chat..." 
                    className="shadow-none border-stone-100 bg-stone-50"
                />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredConversations.map(conv => (
                    <div 
                        key={conv.user._id}
                        onClick={() => navigate(`/admin/chats/${conv.user._id}`)}
                        className={`p-4 cursor-pointer transition-all duration-200 border-b border-stone-50 flex items-center gap-3 relative group ${
                            userId === conv.user._id 
                            ? 'bg-white border-l-4 border-l-ituka-gold' 
                            : 'bg-transparent hover:bg-white hover:shadow-sm border-l-4 border-l-transparent'
                        }`}
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-serif border ${
                                userId === conv.user._id 
                                ? 'bg-ituka-text text-ituka-gold border-ituka-gold/20' 
                                : 'bg-white text-stone-500 border-stone-200'
                            }`}>
                                {conv.user.name.charAt(0).toUpperCase()}
                            </div>
                            {conv.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm px-1">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </div>

                        {/* Info Mensaje */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className={`truncate text-sm font-bold ${userId === conv.user._id ? 'text-ituka-text' : 'text-stone-800'}`}>
                                    {conv.user.name}
                                </h3>
                                <span className={`text-[10px] font-medium flex-shrink-0 ml-1 ${conv.unreadCount > 0 ? 'text-ituka-gold font-bold' : 'text-stone-400'}`}>
                                    {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className={`text-xs truncate max-w-[180px] ${conv.unreadCount > 0 ? 'font-bold text-stone-900' : 'text-stone-500'}`}>
                                    {conv.lastMessage?.content || 'Inicia chat...'}
                                </p>
                                {userId === conv.user._id && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-ituka-gold ml-2 flex-shrink-0"></span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* B. ÁREA CENTRAL (Chat + Contexto) - Columna Derecha */}
        <div className="flex-1 flex overflow-hidden bg-white">
            {userId ? (
                <>
                    {/* Widget de Chat */}
                    <div className="flex-1 flex flex-col relative border-r border-stone-100 last:border-r-0">
                        <div className="px-6 py-3 border-b border-stone-100 flex justify-between items-center bg-white z-10 h-[73px]">
                            <div className="flex items-center gap-3">
                                <h2 className="font-bold text-lg text-ituka-text font-serif">
                                    {selectedConversation?.user?.name || 'Chat'}
                                </h2>
                                
                                {relatedRequest && (
                                    <div className="hidden md:flex items-center gap-2 pl-3 border-l border-stone-100 ml-1">
                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Último pedido:</span>
                                        <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-lg border border-stone-100">
                                            <span className="text-xs font-bold text-stone-600 truncate max-w-[120px]">
                                                {relatedRequest.items[0]?.product?.name || 'Producto'}
                                            </span>
                                            <StatusBadge status={relatedRequest.status} size="xs" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate(`/admin/clients?search=${selectedConversation?.user?.name}`)}
                                    className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-xl transition-all border border-transparent hover:border-stone-100"
                                    title="Ver perfil del cliente"
                                >
                                    <User className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setShowDetails(!showDetails)}
                                    className={`p-2 rounded-xl transition-colors border border-transparent ${showDetails ? 'bg-ituka-gold/10 text-ituka-gold border-ituka-gold/20' : 'text-stone-400 hover:bg-stone-50 hover:border-stone-100'}`}
                                    title={showDetails ? "Ocultar contexto" : "Ver contexto del pedido"}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 relative bg-[#FDFBF7]"> {/* Fondo sutil para chat */}
                            <AdminChatWidget 
                                userId={userId} 
                                userName={selectedConversation?.user?.name}
                            />
                        </div>
                    </div>

                    {/* C. PANEL LATERAL: CONTEXTO DEL PEDIDO (Plegable dentro del contenedor) */}
                    {showDetails && (
                        <div className="w-80 flex flex-col bg-white overflow-hidden animate-in slide-in-from-right duration-300 border-l border-stone-100">
                            <div className="p-5 border-b border-stone-100 bg-stone-50/30 h-[73px] flex items-center"> {/* Altura coincidente con header chat aprox */}
                                <h3 className="font-bold text-xs text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4" /> Contexto
                                </h3>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white">
                                {relatedRequest ? (
                                    <div className="space-y-6">
                                        {/* Estado y Acciones Rápidas */}
                                        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-bold text-stone-400">Solicitud Reciente</span>
                                                <StatusBadge status={relatedRequest.status} size="xs" />
                                            </div>
                                            <p className="text-2xl font-serif font-bold text-ituka-text mb-1">${relatedRequest.total}</p>
                                            <p className="text-xs text-stone-500 mb-4">{new Date(relatedRequest.createdAt).toLocaleDateString()}</p>
                                            
                                            {relatedRequest.status !== 'confirmado' && relatedRequest.status !== 'cancelado' ? (
                                                <div className="space-y-2.5">
                                                    <button 
                                                        onClick={() => updateRequestStatus(relatedRequest._id, 'confirmado')}
                                                        className="w-full py-3 bg-ituka-green text-white rounded-xl text-xs font-bold shadow-md hover:bg-ituka-green/90 transition-all flex items-center justify-center gap-2 group"
                                                    >
                                                        <CheckCheck className="w-4 h-4 group-hover:scale-110 transition-transform" /> Confirmar Pedido
                                                    </button>
                                                    
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => updateRequestStatus(relatedRequest._id, 'cancelado')}
                                                            className="flex-1 py-2.5 bg-white text-red-500 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-1.5"
                                                        >
                                                            <X className="w-3.5 h-3.5" /> Rechazar
                                                        </button>
                                                        <button 
                                                            onClick={() => navigate(`/admin/requests?search=${relatedRequest._id}`)}
                                                            className="flex-1 py-2.5 bg-white text-stone-500 border border-stone-200 rounded-xl text-xs font-bold hover:bg-stone-50 transition-all"
                                                        >
                                                            Ver Detalles
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => navigate(`/admin/requests?search=${relatedRequest._id}`)}
                                                    className={`w-full py-3 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                                                        relatedRequest.status === 'confirmado' 
                                                        ? 'bg-ituka-gold/10 text-ituka-gold border border-ituka-gold/20 hover:bg-ituka-gold/20'
                                                        : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                                                    }`}
                                                >
                                                    {relatedRequest.status === 'confirmado' ? 'Pedido Confirmado' : 'Solicitud Rechazada'} 
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Productos Resumen */}
                                        <div>
                                            <h4 className="font-bold text-sm text-stone-700 mb-3">Productos ({relatedRequest.items.length})</h4>
                                            <div className="space-y-3">
                                                {relatedRequest.items.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                            {item.product?.images?.[0] ? (
                                                                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <ShoppingBag className="w-4 h-4 text-stone-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-stone-700 truncate">{item.product?.name}</p>
                                                            <p className="text-[10px] text-stone-500">{item.quantity} x ${item.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {relatedRequest.items.length > 3 && (
                                                    <p className="text-xs text-stone-400 text-center italic">+ {relatedRequest.items.length - 3} más...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-stone-400">
                                        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">Este usuario no tiene solicitudes recientes.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex-1 bg-white rounded-[32px] border border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-center">
                    <EmptyState 
                        icon={MessageSquare}
                        title="Selecciona una conversación"
                        description="Elige un cliente de la lista para ver el historial y gestionar sus pedidos."
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
