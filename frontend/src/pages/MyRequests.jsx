import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRequests } from "../lib/api";
import { getToken } from "../lib/auth";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, MessageSquare } from "lucide-react";

export default function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadRequests();
  }, [token, navigate]);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await getMyRequests(token);
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case 'solicitud_recibida':
        return 'bg-ituka-info-soft text-ituka-info border border-ituka-info/20';
      case 'en_conversacion':
        return 'bg-ituka-warning-soft text-ituka-warning border border-ituka-warning/20';
      case 'confirmado':
        return 'bg-ituka-success-soft text-ituka-success border border-ituka-success/20';
      case 'cancelado':
        return 'bg-ituka-danger-soft text-ituka-danger border border-ituka-danger/20';
      default:
        return 'bg-stone-100 text-stone-600 border border-stone-200';
    }
  };

  if (loading) return <div className="min-h-screen bg-ituka-cream-soft flex items-center justify-center text-ituka-ink">Cargando solicitudes...</div>;
  if (error) return <div className="min-h-screen bg-ituka-cream-soft flex items-center justify-center text-ituka-danger">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-ituka-cream-soft font-sans py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-ituka-ink mb-8">Solicitudes</h2>

        {requests.length === 0 ? (
          <div className="bg-ituka-surface border border-ituka-border rounded-2xl p-10 text-ituka-ink-muted">
            No tienes solicitudes realizadas.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <button
                key={req._id}
                type="button"
                onClick={() => navigate("/chat", { state: { requestId: req._id } })}
                className="w-full text-left bg-white border border-ituka-border rounded-[28px] shadow-ituka-card p-6 hover:bg-ituka-cream transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-ituka-ink text-lg leading-tight truncate">
                      {(user?.name || "Tú").split(/\s+/)[0]} → {req.items?.[0]?.product?.name || "Producto"} → {req.status?.replaceAll("_", " ") || "nueva"}
                    </p>
                    <p className="text-ituka-ink-muted text-sm font-medium mt-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-ituka-gold" />
                      Abrir chat directo
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClasses(req.status)}`}>
                      {req.status?.replaceAll('_', ' ') || 'nueva'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-ituka-gold" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
