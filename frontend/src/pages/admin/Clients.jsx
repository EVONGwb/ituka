import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Clientes</h2>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 text-stone-600 font-medium border-b border-stone-200">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Registrado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {clients.map(client => (
              <tr key={client._id} className="hover:bg-stone-50">
                <td className="p-4 font-medium text-stone-800">{client.name}</td>
                <td className="p-4 text-stone-600 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-stone-400" />
                  {client.email}
                </td>
                <td className="p-4 text-stone-500 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <Link to={`/admin/chats/${client._id}`} className="text-green-700 hover:underline">
                    Ver historial
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
