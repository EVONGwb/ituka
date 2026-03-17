import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { EmptyState, StatusBadge } from '../../components/admin/ui';
import { Users, MessageSquare, FileText, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useAdminPreferences } from '../../context/AdminPreferencesContext';
import { formatDate, formatDateTime } from '../../lib/adminDateFormat';

const REQUEST_STATUSES = new Set(['solicitud_recibida', 'en_conversacion']);

export default function AdminClientProfile() {
  const { id } = useParams();
  const { prefs } = useAdminPreferences();
  const [client, setClient] = useState(null);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setClientsLoading(true);

      try {
        const [{ data: users }, { data: orderHistory }] = await Promise.all([
          api.get('/users'),
          api.get(`/users/${id}/history`)
        ]);

        const list = Array.isArray(users) ? users : [];
        const found = list.find((u) => u?._id === id) || null;
        if (mounted) setClient(found);

        const history = Array.isArray(orderHistory) ? orderHistory : [];
        const pedidos = history.filter((o) => !REQUEST_STATUSES.has(o.status));
        if (mounted) setOrders(pedidos);
      } catch (e) {
        if (mounted) {
          setClient(null);
          setOrders([]);
        }
      } finally {
        if (mounted) setClientsLoading(false);
      }

      try {
        const { data } = await api.get(`/orders/requests?userId=${id}`);
        const list = Array.isArray(data) ? data : [];
        if (mounted) setRequests(list.filter((o) => REQUEST_STATUSES.has(o.status)));
      } catch (e) {
        if (mounted) setRequests([]);
      }

      try {
        const { data: chat } = await api.get(`/chat/admin/user/${id}`);
        const chatId = chat?._id;
        if (chatId) {
          const { data: history } = await api.get(`/chat/${chatId}/messages`);
          const list = Array.isArray(history) ? history : [];
          if (mounted) setMessages(list.slice(-30));
        } else {
          if (mounted) setMessages([]);
        }
      } catch (e) {
        if (mounted) setMessages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const basicAddress = useMemo(() => {
    const a = client?.address;
    if (!a) return '';
    return [a.street, a.city, a.state, a.zip, a.country].filter(Boolean).join(', ');
  }, [client]);

  if (!clientsLoading && !client) {
    return (
      <div className="bg-[#F9F9F7]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-serif text-ituka-text tracking-tight">Perfil del cliente</h1>
          <p className="text-stone-500 text-sm mt-1">Información del cliente y su historial</p>
        </div>
        <EmptyState
          icon={Users}
          title="Cliente no encontrado"
          description="Vuelve a la lista de clientes y selecciona un cliente válido."
          action={
            <Link
              to="/admin/clients"
              className="inline-flex items-center justify-center px-6 py-3 bg-ituka-green text-white rounded-xl font-bold shadow-md hover:bg-ituka-green/90 transition-colors"
            >
              Volver a clientes
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F7]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold font-serif text-ituka-text tracking-tight truncate">
            {client?.name || 'Cliente'}
          </h1>
          <p className="text-stone-500 text-sm mt-1 truncate">Perfil completo del cliente</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/admin/chats/${id}`}
            className="px-4 py-2.5 bg-ituka-green text-white rounded-xl text-xs font-bold shadow-md hover:bg-ituka-green/90 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Abrir chat
          </Link>
          <Link
            to={`/admin/orders?search=${id}`}
            className="px-4 py-2.5 bg-white text-stone-600 border border-stone-200 rounded-xl text-xs font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Ver pedidos
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm p-5">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Datos básicos</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Mail className="w-4 h-4 text-stone-400" />
                <span className="font-bold truncate">{client?.email || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Phone className="w-4 h-4 text-stone-400" />
                <span className="font-bold truncate">{client?.phone || '—'}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-stone-700">
                <MapPin className="w-4 h-4 text-stone-400 mt-0.5" />
                <span className="font-bold">{basicAddress || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>
                  Registro: {client?.createdAt ? formatDate(client.createdAt, prefs) : '—'} · Última actividad:{' '}
                  {client?.stats?.lastActivity ? formatDate(client.stats.lastActivity, prefs) : 'Sin actividad'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm p-5">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Resumen</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Solicitudes</p>
                <p className="text-xl font-bold text-ituka-text mt-1">{client?.stats?.requestsCount || 0}</p>
              </div>
              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Pedidos</p>
                <p className="text-xl font-bold text-ituka-text mt-1">{client?.stats?.ordersCount || 0}</p>
              </div>
              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Gastado</p>
                <p className="text-xl font-bold text-ituka-green mt-1">${client?.stats?.totalSpent || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-100 bg-[#FAFAF9]">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Historial de solicitudes</p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-sm text-stone-500">Cargando...</div>
              ) : requests.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Sin solicitudes"
                  description="Este cliente aún no ha enviado solicitudes."
                />
              ) : (
                <div className="divide-y divide-stone-100">
                  {requests.map((r) => (
                    <div key={r._id} className="py-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ituka-text">#{String(r._id).slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-stone-400 mt-1">
                          {r.items?.[0]?.product?.name || 'Producto'}{r.items?.length > 1 ? ` +${r.items.length - 1} más` : ''}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1">{r.createdAt ? formatDate(r.createdAt, prefs) : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={r.status} size="xs" />
                        <Link
                          to={`/admin/requests?search=${r._id}`}
                          className="px-3 py-2 bg-white text-stone-600 border border-stone-200 rounded-xl text-xs font-bold hover:bg-stone-50 transition-colors"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-100 bg-[#FAFAF9]">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Historial de pedidos</p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-sm text-stone-500">Cargando...</div>
              ) : orders.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Sin pedidos"
                  description="Este cliente aún no tiene pedidos confirmados."
                />
              ) : (
                <div className="divide-y divide-stone-100">
                  {orders.map((o) => (
                    <div key={o._id} className="py-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ituka-text">#{String(o._id).slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-stone-400 mt-1">
                          {o.items?.[0]?.product?.name || 'Producto'}{o.items?.length > 1 ? ` +${o.items.length - 1} más` : ''}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1">{o.createdAt ? formatDate(o.createdAt, prefs) : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={o.status} size="xs" type="order" />
                        <Link
                          to={`/admin/orders?search=${o._id}`}
                          className="px-3 py-2 bg-white text-stone-600 border border-stone-200 rounded-xl text-xs font-bold hover:bg-stone-50 transition-colors"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-100 bg-[#FAFAF9]">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Historial de mensajes</p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-sm text-stone-500">Cargando...</div>
              ) : messages.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="Sin mensajes"
                  description="Aún no hay conversaciones registradas con este cliente."
                />
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => {
                    const isAdmin = m.senderRole === 'admin';
                    return (
                      <div key={m._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm border ${
                          isAdmin ? 'bg-ituka-gold text-white border-ituka-gold/20' : 'bg-white text-stone-700 border-stone-200'
                        }`}>
                          <p className="whitespace-pre-wrap">{m.content || (m.imageUrl ? 'Adjunto' : '')}</p>
                          <p className={`text-[10px] mt-2 font-medium ${isAdmin ? 'text-white/80' : 'text-stone-400'}`}>
                            {m.createdAt ? formatDateTime(m.createdAt, prefs) : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
