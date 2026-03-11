import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { 
  FileText, 
  ShoppingBag, 
  Package, 
  Users, 
  MessageSquare
} from 'lucide-react';

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

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const statCards = [
    { label: 'Solicitudes Nuevas', value: stats.newRequests, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pedidos Activos', value: stats.activeOrders, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Productos', value: stats.totalProducts, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Clientes', value: stats.totalClients, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Mensajes Pendientes', value: stats.pendingMessages, icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-stone-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
