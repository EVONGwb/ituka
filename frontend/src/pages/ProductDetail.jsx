import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../lib/api';
import { getToken } from '../lib/auth';
import { ArrowLeft, Minus, Plus, Heart, ShoppingBag, Check, Sparkles } from 'lucide-react';

function toListItems(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  const text = String(value).trim();
  if (!text) return [];
  return text
    .split(/\r?\n|•|·|—|–|,|;|\s+-\s+|\s+\-\s+/)
    .map((s) => String(s).trim())
    .filter(Boolean);
}

function DetailBlock({ title, items, variant = 'bullets' }) {
  const [expanded, setExpanded] = useState(false);
  const normalized = Array.isArray(items) ? items : [];
  const hasMore = normalized.length > 6;
  const visible = expanded ? normalized : normalized.slice(0, 6);

  return (
    <div className="ituka-card p-5 sm:p-6">
      <h3 className="text-base sm:text-lg font-serif font-bold text-ituka-ink mb-4 flex items-center gap-2">
        <Check className="w-4 h-4 text-ituka-green" /> {title}
      </h3>

      {variant === 'steps' ? (
        <ol className="space-y-2 list-decimal list-inside text-ituka-ink-muted/80 text-sm leading-relaxed">
          {visible.map((t, idx) => (
            <li key={`${title}-${idx}`}>{t}</li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2 text-ituka-ink-muted/80 text-sm leading-relaxed">
          {visible.map((t, idx) => (
            <li key={`${title}-${idx}`} className="flex gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-ituka-gold flex-shrink-0" />
              <span className="min-w-0">{t}</span>
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-sm font-bold text-ituka-gold hover:text-ituka-gold/80 transition-colors"
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = getToken();
    if (!token) {
      if (window.confirm('Necesitas iniciar sesión para añadir al carrito. ¿Ir al login?')) {
        navigate('/login');
      }
      return;
    }

    setAdding(true);
    try {
      await addToCart(token, product._id, quantity);
      setToast('Añadido a la cesta');
      setTimeout(() => setToast(''), 1600);
    } catch (err) {
      console.error(err);
      alert('Error al añadir al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-ituka-cream-soft"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ituka-gold"></div></div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-ituka-cream-soft min-h-screen">{error}</div>;
  if (!product) return <div className="text-center py-20 text-ituka-ink-muted bg-ituka-cream-soft min-h-screen">Producto no encontrado</div>;

  const { name, price, description, ingredients, benefits, usageMode, skinTypes, images, category } = product;
  const mainImage = images && images.length > 0 ? images[0] : 'https://placehold.co/800x800?text=No+Image';
  const ingredientItems = toListItems(ingredients);
  const benefitItems = toListItems(benefits);
  const usageItems = toListItems(usageMode);
  const mainBenefit = (() => {
    if (Array.isArray(benefits)) return benefits.find((b) => typeof b === 'string' && b.trim())?.trim();
    if (typeof benefits !== 'string') return null;
    const trimmed = benefits.trim();
    if (!trimmed) return null;
    const candidate = trimmed.split(/\r?\n|•|\s+-\s+|,|\.|;/)[0]?.trim();
    return candidate || trimmed.slice(0, 80);
  })();

  return (
    <div className="min-h-screen bg-ituka-cream-soft font-sans pb-[168px]">
      {toast && (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
          <div className="bg-ituka-green text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-bold">
            {toast}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-ituka-ink-muted hover:text-ituka-gold mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Volver
        </Link>

        <div className="ituka-card p-3 sm:p-4">
          <div className="h-[52vh] sm:h-[56vh] rounded-2xl overflow-hidden bg-ituka-cream">
            <img 
              src={mainImage} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-ituka-ink/55 font-bold uppercase tracking-widest text-xs">
            {category}
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-ituka-ink leading-tight">
            {name}
          </h1>

          {mainBenefit ? (
            <p className="mt-2 text-ituka-ink-muted text-base sm:text-lg font-medium">
              {mainBenefit}
            </p>
          ) : null}
        </div>

        <div className="mt-7 border-t border-ituka-gold/20 pt-7">
          <div className="grid gap-5 sm:gap-6">
            {ingredientItems.length > 0 && <DetailBlock title="Ingredientes principales" items={ingredientItems} />}
            {usageItems.length > 0 && <DetailBlock title="Modo de uso" items={usageItems} variant="steps" />}
          </div>
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-16 bg-white/95 backdrop-blur border-t border-ituka-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <div className="flex items-center border border-ituka-gold/50 rounded-full px-2 bg-ituka-cream-soft">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-3 text-ituka-green hover:bg-ituka-cream rounded-full transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-ituka-ink">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="p-3 text-ituka-green hover:bg-ituka-cream rounded-full transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button 
            className={`flex-1 py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2 transition-all
              ${adding ? 'bg-ituka-ink-muted cursor-not-allowed' : 'bg-ituka-gold hover:bg-ituka-gold/90 text-white shadow-ituka-gold/30'}`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Añadiendo...' : <><ShoppingBag className="w-5 h-5" /> Añadir a cesta</>}
          </button>

          <button 
            className="p-4 border border-ituka-gold text-ituka-gold rounded-2xl hover:bg-ituka-gold hover:text-white transition-colors"
            onClick={() => alert('Añadido a favoritos')}
            aria-label="Favorito"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
