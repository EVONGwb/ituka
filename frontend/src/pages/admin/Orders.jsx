import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { MessageSquare, ChevronDown, CreditCard, MapPin, Truck, Package } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { SectionHeader, SearchInput, StatusBadge, EmptyState } from '../../components/admin/ui';

const STATUSES = [
  'confirmado', 
  'pagado', 
  'en_preparacion', 
  'enviado', 
  'listo_para_recoger', 
  'entregado', 
  'cancelado'
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      // Filter out 'solicitud_recibida' as they are in Requests page
      setOrders(data.filter(o => o.status !== 'solicitud_recibida'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar estado');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'todos' || o.status === filterStatus;
    const matchesSearch = o.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.user?._id.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Nivel 1: Título y Contexto */}
      <SectionHeader 
        title="Control de Pedidos" 
        description="Gestiona el flujo comercial, pagos y logística"
      />

      {/* Nivel 2: Filtros */}
      <div className="bg-white p-6 rounded-[24px] border border-stone-200 mb-8 flex flex-col md:flex-row gap-4 shadow-sm items-center">
        <SearchInput 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Buscar por ID, cliente..." 
        />
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setFilterStatus('todos')}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap border ${filterStatus === 'todos' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
          >
            Todos
          </button>
          {['pagado', 'enviado', 'entregado', 'cancelado'].map(status => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap capitalize border ${filterStatus === status ? 'bg-ituka-green text-white border-ituka-green' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Nivel 3: Tabla Detallada */}
      <div className="bg-white rounded-[24px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FAFAF9] text-stone-600 font-bold border-b border-stone-100 text-xs uppercase tracking-wider font-serif">
              <tr>
                <th className="p-6 pl-8">Pedido</th>
                <th className="p-6">Cliente</th>
                <th className="p-6">Método Pago</th>
                <th className="p-6">Entrega</th>
                <th className="p-6">Total</th>
                <th className="p-6">Estado</th>
                <th className="p-6 text-right pr-8">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loading && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-stone-500">Cargando...</td>
                </tr>
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <EmptyState 
                      icon={Package} 
                      title="No hay pedidos con este criterio" 
                      description="Intenta cambiar los filtros de búsqueda."
                    />
                  </td>
                </tr>
              )}
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-[#FAFAF9] transition-colors group">
                  <td className="p-6 pl-8">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-bold text-stone-800 tracking-wide">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-1 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-ituka-text text-sm">{order.user?.name || 'Desconocido'}</div>
                    <div className="text-[10px] text-stone-400">{order.user?.email}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <CreditCard className="w-4 h-4 text-stone-300" />
                      <span className="capitalize font-medium">{order.paymentMethod || 'Pendiente'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      {order.deliveryMethod === 'recogida' ? <MapPin className="w-4 h-4 text-stone-300" /> : <Truck className="w-4 h-4 text-stone-300" />}
                      <span className="capitalize font-medium">{order.deliveryMethod || 'Pendiente'}</span>
                    </div>
                  </td>
                  <td className="p-6 text-ituka-text font-bold text-sm font-serif">${order.total}</td>
                  <td className="p-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-6 text-right pr-8 flex justify-end gap-2 items-center">
                    <div className="relative group">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 border border-stone-200 rounded-xl text-xs bg-white hover:border-ituka-green focus:outline-none focus:ring-2 focus:ring-ituka-green/20 cursor-pointer transition-colors font-bold text-stone-600 shadow-sm"
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    
                    <Link 
                      to={`/admin/chats/${order.user?._id}`} 
                      className="p-2 text-stone-400 hover:text-ituka-green hover:bg-[#E8F5E9] rounded-xl transition-colors"
                      title="Enviar mensaje"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
