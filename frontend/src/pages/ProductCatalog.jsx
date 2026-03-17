import React, { useState, useEffect } from 'react';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [category, setCategory] = useState('');
  const [skinType, setSkinType] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category, skinType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      if (skinType) params.skinType = skinType;
      
      const data = await getProducts(params);
      setProducts(data.products || []);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Cuidado Facial', 'Cuidado Corporal', 'Aceites', 'Serums', 'Protectores Solares'];
  const skinTypes = ['Seca', 'Grasa', 'Mixta', 'Sensible', 'Normal', 'Todo tipo'];

  return (
    <div className="min-h-screen bg-ituka-cream-soft font-sans">
      {/* Header Banner */}
      <div className="bg-ituka-ink text-ituka-cream py-16 px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
         <div className="relative z-10">
           <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Catálogo</h1>
           <p className="text-lg text-ituka-gold max-w-2xl mx-auto font-light">
             Explora nuestra selección de productos naturales diseñados para nutrir tu piel desde la raíz.
           </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters Bar */}
        <div className="bg-ituka-surface rounded-xl shadow-sm p-6 mb-12 flex flex-col md:flex-row gap-6 items-center border border-ituka-border">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ituka-gold w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-ituka-cream-soft border-none rounded-lg focus:ring-2 focus:ring-ituka-gold/30 text-ituka-ink placeholder-ituka-ink/40 transition-all"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-ituka-green w-4 h-4" />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-ituka-surface border border-ituka-border rounded-lg text-ituka-ink focus:border-ituka-gold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Todas las Categorías</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>

             <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-ituka-green w-4 h-4" />
                <select 
                  value={skinType} 
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-ituka-surface border border-ituka-border rounded-lg text-ituka-ink focus:border-ituka-gold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Tipo de Piel</option>
                  {skinTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ituka-gold"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-ituka-ink-muted">
             <p className="text-xl font-serif">No se encontraron productos.</p>
             <button 
               onClick={() => {setSearch(''); setCategory(''); setSkinType('')}}
               className="mt-4 text-ituka-green underline hover:text-ituka-ink"
             >
               Limpiar filtros
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
