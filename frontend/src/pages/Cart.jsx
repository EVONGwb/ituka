import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, updateCartNote, createRequest } from "../lib/api";
import { getToken } from "../lib/auth";
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadCart();
  }, [token, navigate]);

  async function loadCart() {
    setLoading(true);
    try {
      const data = await getCart(token);
      setCart(data);
      setNote(data.note || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateQuantity(productId, newQty) {
    try {
      const updatedCart = await updateCartItem(token, productId, newQty);
      setCart(updatedCart);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRemove(productId) {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      const updatedCart = await removeCartItem(token, productId);
      setCart(updatedCart);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSaveNote() {
    try {
      await updateCartNote(token, note);
      // alert("Nota guardada"); // Feedback subtle preferred
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCheckout() {
    if (!confirm("¿Enviar solicitud?")) return;
    try {
      setSending(true);
      await updateCartNote(token, note);
      const created = await createRequest(token, note);
      setToast("Solicitud enviada correctamente");
      setTimeout(() => setToast(""), 1800);
      const requestId = created?._id;
      setTimeout(() => {
        if (requestId) navigate("/chat", { state: { requestId } });
        else navigate("/chat");
      }, 700);
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-ituka-cream-soft"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ituka-gold"></div></div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-ituka-cream-soft min-h-screen">Error: {error}</div>;

  const total = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
  const productsCount = cart?.items?.length || 0;
  const itemsCount = cart?.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-ituka-cream-soft font-sans pb-[168px] pt-12 px-6">
      {toast && (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
          <div className="bg-ituka-green text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-bold">
            {toast}
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl bg-white border border-ituka-border hover:bg-ituka-cream transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-ituka-ink" />
          </button>
          <h1 className="text-4xl font-serif font-bold text-ituka-ink">Cesta</h1>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
             <div className="text-6xl mb-6">🧴</div>
             <h2 className="text-2xl font-serif text-ituka-ink mb-4">Tu cesta está vacía</h2>
             <p className="text-ituka-ink-muted mb-8">Parece que aún no has añadido productos.</p>
             <Link to="/products" className="inline-block bg-ituka-gold text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-ituka-gold/90 transition-colors">
               Explorar Productos
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.items.map((item) => (
              <div key={item.product._id} className="bg-white rounded-2xl p-6 shadow-sm flex gap-6 items-center border border-ituka-border">
                <div className="w-24 h-24 bg-ituka-cream rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.images?.[0] || 'https://placehold.co/200x200'} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow min-w-0">
                  <h4 className="font-serif font-bold text-lg text-ituka-ink mb-1 truncate">{item.product.name}</h4>
                  <p className="text-ituka-ink-muted text-sm font-medium">Cantidad: {item.quantity}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-ituka-gold/30 rounded-full px-2 py-1">
                    <button 
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} 
                      disabled={item.quantity <= 1}
                      className="p-2 text-ituka-green disabled:opacity-30 hover:bg-ituka-cream rounded-full transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-ituka-ink">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      className="p-2 text-ituka-green hover:bg-ituka-cream rounded-full transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.product._id)} 
                    className="text-red-400 hover:text-red-600 transition-colors p-2"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!!cart && cart.items.length > 0 && (
        <div className="fixed left-0 right-0 bottom-16 bg-white/95 backdrop-blur border-t border-ituka-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ituka-ink">
                {productsCount} producto{productsCount === 1 ? '' : 's'} · {itemsCount} unidad{itemsCount === 1 ? '' : 'es'}
              </p>
              <div className="mt-1 flex -space-x-2">
                {cart.items.slice(0, 6).map((item) => (
                  <div
                    key={item.product._id}
                    className="w-8 h-8 rounded-full bg-ituka-cream border border-ituka-border overflow-hidden"
                    title={item.product.name}
                  >
                    <img
                      src={item.product.images?.[0] || 'https://placehold.co/200x200'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={sending}
              className="bg-ituka-gold text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-ituka-gold/90 transition-colors shadow-lg shadow-ituka-gold/20 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
