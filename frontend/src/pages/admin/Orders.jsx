import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUSES = [
  'solicitud_recibida', 
  'en_conversacion', 
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'bg-blue-100 text-blue-800';
      case 'pagado': return 'bg-green-100 text-green-800';
      case 'enviado': return 'bg-purple-100 text-purple-800';
      case 'entregado': return 'bg-emerald-100 text-emerald-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Pedidos</h2>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-stone-600 font-medium border-b border-stone-200">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Fecha</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-stone-500">No hay pedidos activos</td>
              </tr>
            )}
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-stone-50">
                <td className="p-4 font-mono text-xs text-stone-500">#{order._id.slice(-6)}</td>
                <td className="p-4">
                  <div className="font-medium text-stone-800">{order.user?.name || 'Usuario desconocido'}</div>
                </td>
                <td className="p-4 text-stone-800 font-semibold">${order.total}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-4 text-stone-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right flex justify-end gap-2 items-center">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="p-2 border rounded-lg text-sm bg-white"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <Link 
                    to={`/admin/chats/${order.user?._id}`} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Chat"
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
  );
}
