import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../lib/api';
import { getToken } from '../lib/auth';
import { ArrowLeft, Minus, Plus, Heart, ShoppingBag, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

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
      alert('Producto añadido al carrito exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al añadir al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#F9F7F2]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#556B2F]"></div></div>;
  if (error) return <div className="text-center py-20 text-red-500 bg-[#F9F7F2] min-h-screen">{error}</div>;
  if (!product) return <div className="text-center py-20 text-[#5D4037] bg-[#F9F7F2] min-h-screen">Producto no encontrado</div>;

  const { name, price, description, ingredients, benefits, usageMode, skinTypes, images, category } = product;
  const mainImage = images && images.length > 0 ? images[0] : 'https://placehold.co/800x800?text=No+Image';

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-[#5D4037] hover:text-[#556B2F] mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="bg-white rounded-3xl p-4 shadow-xl shadow-[#556B2F]/5">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F5F5DC]">
              <img 
                src={mainImage} 
                alt={name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <span className="text-[#556B2F] font-bold uppercase tracking-widest text-sm mb-4">
              {category}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3E2723] mb-4 leading-tight">{name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
               <span className="text-3xl font-light text-[#5D4037]">${price.toFixed(2)}</span>
               {skinTypes && (
                 <div className="flex gap-2">
                   {skinTypes.map(type => (
                     <span key={type} className="text-xs px-2 py-1 bg-[#EBE5CE] text-[#556B2F] rounded-full uppercase tracking-wider font-bold">
                       {type}
                     </span>
                   ))}
                 </div>
               )}
            </div>

            <p className="text-[#5D4037]/80 text-lg leading-relaxed mb-10">
              {description}
            </p>

            <div className="flex gap-4 mb-10">
              <div className="flex items-center border border-[#D4AF37]/50 rounded-full px-2">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 text-[#556B2F] hover:bg-[#F5F5DC] rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-[#3E2723]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 text-[#556B2F] hover:bg-[#F5F5DC] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                className={`flex-1 py-4 px-6 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2 transition-all
                  ${adding ? 'bg-[#5D4037] cursor-not-allowed' : 'bg-[#556B2F] hover:bg-[#3E2723] text-white shadow-[#556B2F]/30'}`}
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? 'Añadiendo...' : <><ShoppingBag className="w-5 h-5" /> Añadir a la cesta</>}
              </button>
              
              <button 
                className="p-4 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors"
                onClick={() => alert('Añadido a favoritos')}
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs / Accordions */}
            <div className="space-y-6 border-t border-[#D4AF37]/20 pt-8">
              {ingredients && (
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#3E2723] mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#556B2F]" /> Ingredientes
                  </h3>
                  <p className="text-[#5D4037]/70 text-sm leading-relaxed">{ingredients}</p>
                </div>
              )}

              {benefits && (
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#3E2723] mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#556B2F]" /> Beneficios
                  </h3>
                  <p className="text-[#5D4037]/70 text-sm leading-relaxed">{benefits}</p>
                </div>
              )}

              {usageMode && (
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#3E2723] mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#556B2F]" /> Modo de Uso
                  </h3>
                  <p className="text-[#5D4037]/70 text-sm leading-relaxed">{usageMode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
