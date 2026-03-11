import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { MessageSquare, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/orders/requests');
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`¿Cambiar estado a ${status}?`)) return;
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar estado');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Solicitudes</h2>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-stone-600 font-medium border-b border-stone-200">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Productos</th>
              <th className="p-4">Total</th>
              <th className="p-4">Nota</th>
              <th className="p-4">Fecha</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-stone-500">No hay solicitudes nuevas</td>
              </tr>
            )}
            {requests.map(req => (
              <tr key={req._id} className="hover:bg-stone-50">
                <td className="p-4">
                  <div className="font-medium text-stone-800">{req.user?.name || 'Usuario desconocido'}</div>
                  <div className="text-sm text-stone-500">{req.user?.email}</div>
                </td>
                <td className="p-4 text-stone-600 text-sm">
                  <ul className="list-disc list-inside">
                    {req.items.map((item, i) => (
                      <li key={i}>
                        {item.quantity}x {item.product?.name || 'Producto eliminado'}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 text-stone-800 font-semibold">${req.total}</td>
                <td className="p-4 text-stone-600 italic text-sm max-w-xs truncate">{req.note || '-'}</td>
                <td className="p-4 text-stone-500 text-sm">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link 
                    to={`/admin/chats/${req.user?._id}`} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Abrir Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => updateStatus(req._id, 'en_conversacion')} 
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                    title="Iniciar Conversación"
                  >
                    Conv
                  </button>
                  <button 
                    onClick={() => updateStatus(req._id, 'confirmado')} 
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Confirmar Pedido"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => updateStatus(req._id, 'cancelado')} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
