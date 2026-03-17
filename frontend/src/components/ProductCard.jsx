import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { addToCart } from '../lib/api';
import { getToken } from '../lib/auth';

const ProductCard = ({ product }) => {
  const { _id, name, price, category, images, skinTypes } = product;
  const imageUrl = images && images.length > 0 ? images[0] : 'https://placehold.co/600x600?text=No+Image';
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    const token = getToken();
    if (!token) {
      if (window.confirm('Necesitas iniciar sesión para añadir al carrito. ¿Ir al login?')) {
        navigate('/login');
      }
      return;
    }

    try {
      await addToCart(token, _id, 1);
      alert('Producto añadido a la cesta');
    } catch (err) {
      console.error(err);
      alert('Error al añadir a la cesta');
    }
  };

  return (
    <div className="group bg-ituka-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ituka-border">
      <Link to={`/products/${_id}`} className="block relative">
        <div className="aspect-[4/5] overflow-hidden bg-ituka-cream relative">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 justify-center bg-ituka-surface/90 backdrop-blur-sm">
             <button 
               onClick={handleAddToCart}
               className="flex-1 bg-ituka-gold text-white py-2 px-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-ituka-gold/90 transition-colors flex items-center justify-center gap-2"
             >
               <ShoppingBag className="w-4 h-4" /> Añadir
             </button>
             <button 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
               className="p-2 border border-ituka-gold text-ituka-gold rounded-full hover:bg-ituka-gold hover:text-white transition-colors"
             >
               <Heart className="w-4 h-4" />
             </button>
          </div>
        </div>
        
        <div className="p-5">
          <p className="text-xs text-ituka-green font-bold uppercase tracking-widest mb-1">{category}</p>
          <h3 className="font-serif text-lg font-bold text-ituka-ink mb-2 leading-tight group-hover:text-ituka-gold transition-colors">{name}</h3>
          
          <div className="flex items-center justify-between mt-4">
             <span className="text-lg font-medium text-ituka-ink-muted">${price.toFixed(2)}</span>
             <div className="flex gap-1">
                {skinTypes?.slice(0, 2).map(type => (
                  <span key={type} className="text-[10px] px-2 py-1 bg-ituka-cream text-ituka-ink-muted rounded-full uppercase tracking-wider">
                    {type}
                  </span>
                ))}
             </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
