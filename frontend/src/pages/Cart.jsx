import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, updateCartNote, createRequest } from "../lib/api";
import { getToken } from "../lib/auth";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
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
    if (!confirm("¿Enviar solicitud de pedido?")) return;
    try {
      await createRequest(token, note);
      alert("Solicitud enviada con éxito");
      navigate("/requests");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-ituka-cream-soft"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ituka-gold"></div></div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-ituka-cream-soft min-h-screen">Error: {error}</div>;

  const total = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-ituka-cream-soft font-sans py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-ituka-ink mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-ituka-gold" /> Mi Cesta
        </h1>

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
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <div key={item.product._id} className="bg-white rounded-2xl p-6 shadow-sm flex gap-6 items-center border border-ituka-border">
                  <div className="w-24 h-24 bg-ituka-cream rounded-xl overflow-hidden flex-shrink-0">
                     <img 
                       src={item.product.images?.[0] || 'https://placehold.co/200x200'} 
                       alt={item.product.name} 
                       className="w-full h-full object-cover"
                     />
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="font-serif font-bold text-lg text-ituka-ink mb-1">{item.product.name}</h4>
                    <p className="text-ituka-green font-bold">${item.product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-ituka-gold/30 rounded-full px-2 py-1">
                      <button 
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} 
                        disabled={item.quantity <= 1}
                        className="p-2 text-ituka-green disabled:opacity-30 hover:bg-ituka-cream rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-ituka-ink">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        className="p-2 text-ituka-green hover:bg-ituka-cream rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.product._id)} 
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-2xl p-8 shadow-lg shadow-ituka-green/5 sticky top-24 border border-ituka-border">
                  <h3 className="font-serif font-bold text-xl text-ituka-ink mb-6">Resumen del Pedido</h3>
                  
                  <div className="space-y-4 mb-8 pb-8 border-b border-ituka-border">
                     <div className="flex justify-between text-ituka-ink-muted">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-ituka-ink-muted">
                        <span>Envío</span>
                        <span className="text-ituka-green font-bold">Calculado al final</span>
                     </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold text-ituka-ink mb-8">
                     <span>Total Estimado</span>
                     <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-ituka-ink mb-2">Notas del pedido (Opcional)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onBlur={handleSaveNote}
                      rows={3}
                      className="w-full p-3 bg-ituka-cream-soft border-none rounded-lg text-ituka-ink placeholder-ituka-ink/30 focus:ring-2 focus:ring-ituka-gold/30 transition-all"
                      placeholder="Instrucciones especiales para el envío..."
                    />
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-ituka-gold text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-ituka-gold/90 transition-colors shadow-lg shadow-ituka-gold/20 flex items-center justify-center gap-2"
                  >
                    Enviar Pedido <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
