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

  const getStatusColor = (status) => {
    switch (status) {
      case 'solicitud_recibida': return '#2196f3';
      case 'en_conversacion': return '#9c27b0';
      case 'confirmado': return '#4caf50';
      case 'cancelado': return '#f44336';
      default: return '#666';
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Cargando solicitudes...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "system-ui", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Mis Solicitudes</h2>
        <Link to="/dashboard" style={{ textDecoration: "none", color: "#666" }}>← Volver</Link>
      </div>

      {requests.length === 0 ? (
        <p>No tienes solicitudes realizadas.</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {requests.map((req) => (
            <div key={req._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, backgroundColor: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: "bold" }}>ID: {req._id.slice(-6)}</span>
                <span style={{ 
                  backgroundColor: getStatusColor(req.status), 
                  color: "white", 
                  padding: "2px 8px", 
                  borderRadius: 4, 
                  fontSize: "0.8em",
                  textTransform: "uppercase" 
                }}>
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: "#666", fontSize: "0.9em" }}>
                  {new Date(req.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ borderTop: "1px solid #eee", paddingTop: 10 }}>
                {req.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9em", marginBottom: 5 }}>
                    <span>{item.quantity}x {item.product?.name || 'Producto eliminado'}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>

              {req.note && (
                <div style={{ marginTop: 10, backgroundColor: "#f9f9f9", padding: 8, borderRadius: 4, fontSize: "0.9em", fontStyle: "italic" }}>
                  Note: {req.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
