import { Link, useNavigate } from "react-router-dom";
import { Bell, MessageSquare, ShoppingBag, ClipboardList, ArrowRight, Package, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { getToken } from "../lib/auth";

function statusLabel(status) {
  const s = String(status || "").trim();
  if (!s) return "Actualización";
  return s.replaceAll("_", " ");
}

function formatRelative(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const days = Math.floor(h / 24);
  return `hace ${days} d`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = (user?.name || "").trim();
  const firstName = name ? name.split(/\s+/)[0] : "Prudencio";
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login", { replace: true });
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [cartRes, requestsRes, ordersRes] = await Promise.all([
          api.get("/cart"),
          api.get("/requests/my"),
          api.get("/orders/myorders")
        ]);

        const cartItems = Array.isArray(cartRes.data?.items) ? cartRes.data.items : [];
        const nextCartCount = cartItems.reduce((sum, i) => sum + Number(i?.quantity || 0), 0);

        const reqs = Array.isArray(requestsRes.data) ? requestsRes.data : [];
        const pending = reqs.filter((r) => !["entregado", "cancelado"].includes(r?.status)).length;

        const ords = Array.isArray(ordersRes.data) ? ordersRes.data : [];

        if (mounted) {
          setCartCount(nextCartCount);
          setPendingRequests(pending);
          setRequests(reqs);
          setOrders(ords);
        }
      } catch (e) {
        if (mounted) {
          setCartCount(0);
          setPendingRequests(0);
          setRequests([]);
          setOrders([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const greetingName = useMemo(() => firstName.charAt(0).toUpperCase() + firstName.slice(1), [firstName]);

  const latestRequest = useMemo(() => {
    const list = Array.isArray(requests) ? requests : [];
    return [...list].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))[0] || null;
  }, [requests]);

  const activeChats = useMemo(() => {
    const items = [];
    if (latestRequest?._id) {
      items.push({
        title: `Solicitud #${String(latestRequest._id).slice(-6).toUpperCase()}`,
        subtitle: statusLabel(latestRequest.status),
        onOpen: () => navigate("/chat", { state: { requestId: latestRequest._id } })
      });
    }
    items.push({
      title: "Soporte ITUKA",
      subtitle: "Consulta rápida",
      onOpen: () => navigate("/chat")
    });
    return items;
  }, [latestRequest, navigate]);

  const ordersInProgress = useMemo(() => {
    const ords = Array.isArray(orders) ? orders : [];
    const orderStatuses = new Set(["confirmado", "pagado", "en_preparacion", "enviado", "listo_para_recoger"]);
    return ords.filter((o) => orderStatuses.has(o?.status)).length;
  }, [orders]);

  const recentActivity = useMemo(() => {
    const list = [];
    for (const r of (Array.isArray(requests) ? requests : []).slice(0, 10)) {
      list.push({
        id: `r:${r?._id}`,
        type: "request",
        title: `Solicitud #${String(r?._id || "").slice(-6).toUpperCase()}`,
        subtitle: statusLabel(r?.status),
        date: r?.createdAt,
        onOpen: () => navigate("/chat", { state: { requestId: r?._id } })
      });
    }
    for (const o of (Array.isArray(orders) ? orders : []).slice(0, 10)) {
      list.push({
        id: `o:${o?._id}`,
        type: "order",
        title: `Pedido #${String(o?._id || "").slice(-6).toUpperCase()}`,
        subtitle: statusLabel(o?.status),
        date: o?.createdAt,
        onOpen: () => navigate("/requests")
      });
    }
    return list
      .filter((i) => i.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [orders, requests, navigate]);

  return (
    <div className="min-h-screen bg-ituka-cream-soft font-sans px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-ituka-ink text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Hola, {greetingName}
            </p>
            <p className="text-ituka-ink-muted mt-2 text-base sm:text-lg">
              Cuida tu piel de forma natural
            </p>
          </div>

          <button
            type="button"
            className="w-11 h-11 rounded-2xl bg-white border border-ituka-border shadow-sm flex items-center justify-center hover:bg-ituka-cream transition-colors flex-shrink-0"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-ituka-ink" />
          </button>
        </div>

        <div className="mt-10 ituka-card p-6">
          <p className="text-xs font-bold text-ituka-ink/50 uppercase tracking-widest">ITUKA</p>
          <p className="mt-2 text-ituka-ink text-lg font-serif font-bold leading-snug">
            Una rutina simple. Ingredientes reales. Resultados que se sienten.
          </p>
          <p className="mt-3 text-ituka-ink-muted text-sm leading-relaxed">
            Explora productos, arma tu cesta y envía tu solicitud cuando estés listo.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div className="bg-white rounded-[28px] border border-ituka-border shadow-ituka-card p-6 flex items-start gap-5">
            <div className="w-1.5 self-stretch rounded-full bg-ituka-gold/70" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-ituka-cream-soft border border-ituka-border flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-ituka-ink" />
                  </div>
                  <div>
                    <p className="text-ituka-ink font-serif font-bold text-xl leading-tight">Solicitudes</p>
                    <p className="text-ituka-ink-muted text-sm font-medium mt-1">
                      {loading ? "Cargando..." : `${pendingRequests} pendientes`}
                    </p>
                  </div>
                </div>
                <Link
                  to="/requests"
                  className="text-sm font-bold text-ituka-ink/70 hover:text-ituka-ink transition-colors inline-flex items-center gap-2 flex-shrink-0 mt-1"
                >
                  Ver solicitudes <ArrowRight className="w-4 h-4 text-ituka-gold" />
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 bg-ituka-cream-soft border border-ituka-border rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-ituka-gold" />
                  <p className="text-sm font-bold text-ituka-ink">
                    Tu cesta: {loading ? "…" : `${cartCount} producto${cartCount === 1 ? "" : "s"}`}
                  </p>
                </div>
                  <Link to="/cart" className="text-sm font-bold text-ituka-ink/70 hover:text-ituka-ink transition-colors inline-flex items-center gap-2">
                  Ver cesta <ArrowRight className="w-4 h-4 text-ituka-gold" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] border border-ituka-border shadow-ituka-card p-6 flex items-start gap-5">
            <div className="w-1.5 self-stretch rounded-full bg-ituka-gold/70" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-ituka-cream-soft border border-ituka-border flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-ituka-ink" />
                  </div>
                  <div>
                    <p className="text-ituka-ink font-serif font-bold text-lg leading-tight">Chats activos</p>
                    <p className="text-ituka-ink-muted text-sm font-medium">Responde rápido y sigue el hilo</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {activeChats.map((c) => (
                  <button
                    key={c.title}
                    type="button"
                    onClick={c.onOpen}
                    className="w-full text-left bg-ituka-cream-soft border border-ituka-border rounded-2xl px-4 py-4 hover:bg-ituka-cream transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-ituka-ink font-serif font-bold truncate">{c.title}</p>
                        <p className="text-ituka-ink-muted text-sm font-medium mt-1 truncate">{c.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-ituka-gold flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] border border-ituka-border shadow-ituka-card p-6 flex items-start gap-5">
            <div className="w-1.5 self-stretch rounded-full bg-ituka-gold/70" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-ituka-cream-soft border border-ituka-border flex items-center justify-center">
                    <Package className="w-5 h-5 text-ituka-ink" />
                  </div>
                  <div>
                    <p className="text-ituka-ink font-serif font-bold text-lg leading-tight">Pedidos</p>
                    <p className="text-ituka-ink-muted text-sm font-medium mt-1">
                      {loading ? "Cargando..." : `${ordersInProgress} en curso`}
                    </p>
                  </div>
                </div>
                <Link
                  to="/requests"
                  className="text-sm font-bold text-ituka-ink/70 hover:text-ituka-ink transition-colors inline-flex items-center gap-2 flex-shrink-0 mt-1"
                >
                  Ver pedidos <ArrowRight className="w-4 h-4 text-ituka-gold" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] border border-ituka-border shadow-ituka-card p-6 flex items-start gap-5">
            <div className="w-1.5 self-stretch rounded-full bg-ituka-gold/70" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-ituka-cream-soft border border-ituka-border flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-ituka-ink" />
                </div>
                <div>
                  <p className="text-ituka-ink font-serif font-bold text-lg leading-tight">Actividad reciente</p>
                  <p className="text-ituka-ink-muted text-sm font-medium">Lo último que pasó en tu cuenta</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="bg-ituka-cream-soft border border-ituka-border rounded-2xl px-4 py-4 text-ituka-ink-muted text-sm font-medium">
                    {loading ? "Cargando..." : "Aún no hay actividad para mostrar."}
                  </div>
                ) : (
                  recentActivity.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={a.onOpen}
                      className="w-full text-left bg-ituka-cream-soft border border-ituka-border rounded-2xl px-4 py-4 hover:bg-ituka-cream transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-ituka-ink font-bold truncate">{a.title}</p>
                          <p className="text-ituka-ink-muted text-sm font-medium mt-1 truncate">{a.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-ituka-ink/60 flex-shrink-0">
                          <span>{formatRelative(a.date)}</span>
                          <ArrowRight className="w-4 h-4 text-ituka-gold" />
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
