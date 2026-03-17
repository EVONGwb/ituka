import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp, ShoppingBag, Users, FileText, DollarSign } from 'lucide-react';
import { EmptyState, StatCard } from '../../components/admin/ui';
import { ITUKA_PALETTE } from '../../styles/itukaPalette';

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/admin/analytics?days=${days}`);
        if (mounted) setData(res.data);
      } catch (e) {
        if (mounted) setError(e?.message || 'Error al cargar analítica');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [days]);

  const weeklyRequests = useMemo(() => {
    const rows = Array.isArray(data?.requestsByWeek) ? data.requestsByWeek : [];
    return rows.map((r) => ({
      week: String(r.week || '').split('-W')[1] ? `W${String(r.week || '').split('-W')[1]}` : String(r.week || ''),
      count: Number(r.count || 0)
    }));
  }, [data]);

  const weeklyConfirmed = useMemo(() => {
    const rows = Array.isArray(data?.confirmedOrdersByWeek) ? data.confirmedOrdersByWeek : [];
    return rows.map((r) => ({
      week: String(r.week || '').split('-W')[1] ? `W${String(r.week || '').split('-W')[1]}` : String(r.week || ''),
      count: Number(r.count || 0)
    }));
  }, [data]);

  const topRequested = Array.isArray(data?.topRequestedProducts) ? data.topRequestedProducts : [];
  const topCustomers = Array.isArray(data?.topCustomers) ? data.topCustomers : [];

  const topRequestedMax = useMemo(() => Math.max(1, ...topRequested.map((r) => Number(r.count || 0))), [topRequested]);
  const topCustomersMax = useMemo(() => Math.max(1, ...topCustomers.map((r) => Number(r.totalSpent || 0))), [topCustomers]);

  const requestsReceived = Number(data?.requestsReceived || 0);
  const confirmedOrders = Number(data?.confirmedOrders || 0);
  const salesTotal = Number(data?.salesTotal || 0);

  const hasEnoughData =
    requestsReceived > 0 ||
    confirmedOrders > 0 ||
    salesTotal > 0 ||
    weeklyRequests.some((r) => r.count > 0) ||
    weeklyConfirmed.some((r) => r.count > 0) ||
    topRequested.length > 0 ||
    topCustomers.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ituka-gold"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-stone-100 pb-8">
        <div>
          <h2 className="text-[32px] font-serif font-bold text-ituka-text tracking-tight">Analítica</h2>
          <p className="text-stone-500 text-base mt-1 font-light">Entiende cómo está funcionando el negocio</p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { days: 7, label: 'Últimos 7 días' },
            { days: 30, label: 'Último mes' },
            { days: 90, label: 'Últimos 3 meses' },
            { days: 365, label: 'Último año' }
          ].map((opt) => (
            <button
              key={opt.days}
              onClick={() => setDays(opt.days)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                days === opt.days
                  ? 'bg-ituka-text text-white border-ituka-text shadow-sm'
                  : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {!hasEnoughData ? (
        <EmptyState
          icon={TrendingUp}
          title="Todavía no hay suficientes datos para mostrar analítica."
          description="Cuando la plataforma tenga actividad aparecerán aquí."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard label="Solicitudes recibidas" value={requestsReceived} icon={FileText} color="text-ituka-green" bg="bg-ituka-success-soft" />
            <StatCard label="Pedidos confirmados" value={confirmedOrders} icon={ShoppingBag} color="text-ituka-gold" bg="bg-ituka-warning-soft" />
            <StatCard label="Ventas del mes" value={`$${Math.round(salesTotal * 100) / 100}`} icon={DollarSign} color="text-ituka-green" bg="bg-ituka-success-soft" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 ituka-card p-8">
              <h3 className="font-bold text-ituka-text text-xl flex items-center gap-2 font-serif mb-6">
                <TrendingUp className="w-6 h-6 text-ituka-gold" />
                Solicitudes recibidas por semana
              </h3>
              {weeklyRequests.length === 0 ? (
                <div className="text-stone-500 text-sm">Sin datos recientes.</div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyRequests} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ITUKA_PALETTE.gold} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={ITUKA_PALETTE.gold} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" stroke={ITUKA_PALETTE.stone400} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={ITUKA_PALETTE.stone400} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'white',
                          border: `1px solid ${ITUKA_PALETTE.stone200}`,
                          borderRadius: 14,
                          boxShadow: '0 10px 25px -10px rgba(0,0,0,0.12)'
                        }}
                      />
                      <Area type="monotone" dataKey="count" stroke={ITUKA_PALETTE.gold} fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="ituka-card p-8">
              <h3 className="font-bold text-ituka-text text-xl flex items-center gap-2 font-serif mb-6">
                <ShoppingBag className="w-6 h-6 text-ituka-green" />
                Pedidos confirmados por semana
              </h3>
              {weeklyConfirmed.length === 0 ? (
                <div className="text-stone-500 text-sm">Sin datos recientes.</div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyConfirmed} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ITUKA_PALETTE.green} stopOpacity={0.22} />
                          <stop offset="95%" stopColor={ITUKA_PALETTE.green} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" stroke={ITUKA_PALETTE.stone400} fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke={ITUKA_PALETTE.stone400} fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'white',
                          border: `1px solid ${ITUKA_PALETTE.stone200}`,
                          borderRadius: 14,
                          boxShadow: '0 10px 25px -10px rgba(0,0,0,0.12)'
                        }}
                      />
                      <Area type="monotone" dataKey="count" stroke={ITUKA_PALETTE.green} fillOpacity={1} fill="url(#colorConfirmed)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="ituka-card p-8">
              <h3 className="font-bold text-ituka-text text-xl flex items-center gap-2 font-serif mb-6">
                <TrendingUp className="w-6 h-6 text-ituka-gold" />
                Productos más solicitados
              </h3>

              {topRequested.length === 0 ? (
                <div className="text-stone-500 text-sm">Sin datos todavía.</div>
              ) : (
                <div className="space-y-4">
                  {topRequested.slice(0, 8).map((p, idx) => (
                    <div key={p.productId || idx} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ituka-text truncate">{p.name}</p>
                          <p className="text-[11px] text-stone-400">{p.count} solicitudes</p>
                        </div>
                        <span className="text-xs font-bold text-stone-500 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-ituka-gold/70 rounded-full"
                          style={{ width: `${Math.round((Number(p.count || 0) / topRequestedMax) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="ituka-card p-8">
              <h3 className="font-bold text-ituka-text text-xl flex items-center gap-2 font-serif mb-6">
                <Users className="w-6 h-6 text-ituka-green" />
                Clientes más activos
              </h3>

              {topCustomers.length === 0 ? (
                <div className="text-stone-500 text-sm">Aún no hay compras registradas.</div>
              ) : (
                <div className="space-y-4">
                  {topCustomers.slice(0, 8).map((c, idx) => (
                    <div key={c.userId || idx} className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ituka-text truncate">{c.name || 'Cliente'}</p>
                          <p className="text-[11px] text-stone-400 truncate">{c.email || ''}</p>
                          <p className="text-[11px] text-stone-400 mt-1">{c.ordersCount || 0} pedidos</p>
                        </div>
                        <span className="text-xs font-bold text-stone-500 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full flex-shrink-0">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-2 flex-1 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-ituka-green/70 rounded-full"
                            style={{ width: `${Math.round((Number(c.totalSpent || 0) / topCustomersMax) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs font-bold text-ituka-green flex-shrink-0">
                          ${Math.round(Number(c.totalSpent || 0) * 100) / 100}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
