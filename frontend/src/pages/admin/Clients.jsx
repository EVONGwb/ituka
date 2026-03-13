import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Mail, Phone, MessageSquare, Ban, FileText, Clock, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { SectionHeader, SearchInput, EmptyState } from '../../components/admin/ui';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/users');
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (id) => {
    if(!window.confirm('¿Seguro que quieres bloquear a este usuario?')) return;
    // TODO: Implement block logic in backend
    alert('Funcionalidad de bloqueo pendiente de backend');
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SectionHeader 
        title="CRM Clientes" 
        description="Gestiona tu base de datos de usuarios"
        action={
          <SearchInput 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Buscar por nombre o email..." 
          />
        }
      />

      {loading && <div className="text-center py-12 text-stone-500">Cargando clientes...</div>}

      {!loading && filteredClients.length === 0 && (
        <EmptyState 
          icon={Users} 
          title="No se encontraron clientes" 
          description="Intenta con otro término de búsqueda."
        />
      )}

      {filteredClients.length > 0 && (
        <div className="bg-white rounded-[24px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#FAFAF9] text-stone-600 font-bold border-b border-stone-100 text-xs uppercase tracking-wider font-serif">
                <tr>
                  <th className="p-6 pl-8">Cliente</th>
                  <th className="p-6">Contacto</th>
                  <th className="p-6">Estadísticas</th>
                  <th className="p-6">Última Actividad</th>
                  <th className="p-6">Fecha Alta</th>
                  <th className="p-6 text-right pr-8">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredClients.map(client => (
                  <tr key={client._id} className="hover:bg-[#FAFAF9] transition-colors group">
                    <td className="p-6 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-600 font-bold text-lg border border-stone-100 font-serif">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-ituka-text text-sm">{client.name}</div>
                          <div className="text-[10px] text-stone-400">ID: {client._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-stone-600">
                          <Mail className="w-3 h-3 text-stone-300" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-xs text-stone-600">
                            <Phone className="w-3 h-3 text-stone-300" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-sm font-bold text-stone-800">{client.stats?.ordersCount || 0}</div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wide">Pedidos</div>
                        </div>
                        <div className="text-center border-l border-stone-100 pl-4">
                          <div className="text-sm font-bold text-stone-800">{client.stats?.requestsCount || 0}</div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wide">Solicitudes</div>
                        </div>
                        <div className="text-center border-l border-stone-100 pl-4">
                          <div className="text-sm font-bold text-ituka-green">${client.stats?.totalSpent || 0}</div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-wide">Gastado</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                        <Clock className="w-3 h-3 text-stone-300" />
                        {client.stats?.lastActivity 
                          ? new Date(client.stats.lastActivity).toLocaleDateString() 
                          : 'Sin actividad'}
                      </div>
                    </td>
                    <td className="p-6 text-xs text-stone-500">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right pr-8">
                      <div className="flex justify-end gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/chats/${client._id}`} 
                          className="p-2 text-stone-400 hover:text-ituka-green hover:bg-[#E8F5E9] rounded-xl transition-colors"
                          title="Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/orders?user=${client._id}`} 
                          className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
                          title="Historial"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => blockUser(client._id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Bloquear"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
