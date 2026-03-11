import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, addToCart } from "../lib/api";
import { getToken } from "../lib/auth";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await apiFetch("/products");
      setProducts(res); // apiFetch returns data directly if I look at api.js? No, apiFetch returns data.
      // Wait, api.js returns `data` which is `JSON.parse(text)`.
      // `product.controller.js` returns array of products `res.json(products)`.
      // So `res` is the array.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(productId) {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(token, productId, 1);
      alert("Añadido al carrito!");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Cargando productos...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto", fontFamily: "system-ui", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Catálogo de Productos</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/cart" style={{ textDecoration: "none", color: "#2e7d32", fontWeight: "bold" }}>Ver Cesta</Link>
          <Link to="/dashboard" style={{ textDecoration: "none", color: "#666" }}>Dashboard</Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 15, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 4, marginBottom: 10 }} />}
            <div>
              <h3 style={{ margin: "0 0 5px 0" }}>{p.name}</h3>
              <p style={{ color: "#666", fontSize: "0.9em", margin: "0 0 10px 0" }}>{p.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>${p.price}</span>
                <button 
                  onClick={() => handleAdd(p._id)}
                  style={{ backgroundColor: "#2e7d32", color: "white", padding: "5px 10px", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
