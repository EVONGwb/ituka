import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyRequests } from "../lib/api";
import { getToken } from "../lib/auth";

export default function MyRequests() {
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
    <div className="min-h-screen bg-ituka-cream-soft font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-serif font-bold text-ituka-ink">Mis Solicitudes</h2>
          <Link to="/dashboard" className="text-ituka-muted hover:text-ituka-ink transition-colors">← Volver</Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-ituka-surface border border-ituka-border rounded-2xl p-10 text-ituka-ink-muted">
            No tienes solicitudes realizadas.
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-ituka-surface border border-ituka-border rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm text-ituka-muted">ID</p>
                    <p className="font-bold text-ituka-ink">{req._id.slice(-6)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClasses(req.status)}`}>
                    {req.status.replaceAll('_', ' ')}
                  </span>
                </div>

                <p className="text-sm text-ituka-muted mb-4">
                  {new Date(req.createdAt).toLocaleString()}
                </p>

                <div className="border-t border-ituka-border pt-4 space-y-2">
                  {req.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-ituka-ink">
                        {item.quantity}x {item.product?.name || 'Producto eliminado'}
                      </span>
                      <span className="font-semibold text-ituka-ink-muted">${item.price}</span>
                    </div>
                  ))}
                </div>

                {req.note && (
                  <div className="mt-4 bg-ituka-cream border border-ituka-border rounded-xl p-4 text-sm text-ituka-ink-muted italic">
                    Nota: {req.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
