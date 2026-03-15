import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit, Trash, X, Eye, EyeOff, Star, Image as ImageIcon, Search, Package } from 'lucide-react';
import { SectionHeader, SearchInput, ActionButton, EmptyState, StatusBadge } from '../../components/admin/ui';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    imageUrl: '',
    ingredients: '',
    benefits: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/admin');
      setProducts(Array.isArray(data) ? data : (data?.products || []));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const basePayload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        ingredients: formData.ingredients || '',
        benefits: formData.benefits || '',
        price: formData.price === '' ? 0 : Number(formData.price),
        stock: Number(formData.stock || 0),
        isActive: !!formData.isActive,
        isFeatured: !!formData.isFeatured
      };

      if (selectedImageFile) {
        const payload = new FormData();
        Object.entries(basePayload).forEach(([k, v]) => payload.append(k, String(v)));
        payload.append('images', selectedImageFile);

        if (editingProduct) {
          await api.put(`/products/${editingProduct._id}`, payload);
        } else {
          await api.post('/products', payload);
        }
      } else {
        const payload = {
          ...basePayload,
          ...(formData.imageUrl ? { imageUrl: formData.imageUrl } : {})
        };

        if (editingProduct) {
          await api.put(`/products/${editingProduct._id}`, payload);
        } else {
          await api.post('/products', payload);
        }
      }
      setModalOpen(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || error?.message || 'Error al guardar producto';
      alert(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar producto');
    }
  };

  const toggleStatus = async (product) => {
    try {
      await api.put(`/products/${product._id}`, { isActive: !product.isActive });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await api.put(`/products/${product._id}`, { isFeatured: !product.isFeatured });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.images?.[0] || product.imageUrl || '',
      ingredients: product.ingredients || '',
      benefits: product.benefits || '',
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false
    });
    setSelectedImageFile(null);
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: 0,
      imageUrl: '',
      ingredients: '',
      benefits: '',
      isActive: true,
      isFeatured: false
    });
    setSelectedImageFile(null);
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const name = String(product.name || '');
    const category = String(product.category || '');
    const term = String(searchTerm || '').toLowerCase();

    const matchesSearch = name.toLowerCase().includes(term) || category.toLowerCase().includes(term);
    const matchesCategory = filterCategory === 'all' || category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && product.isActive) || 
                          (filterStatus === 'hidden' && !product.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Nivel 1: Título y Acción Principal */}
      <SectionHeader 
        title="Productos" 
        description="Gestiona inventario, categorías y visibilidad"
        action={
          <ActionButton 
            onClick={() => { resetForm(); setModalOpen(true); }} 
            icon={Plus}
            variant="primary"
          >
            Añadir producto
          </ActionButton>
        }
      />

      {/* Nivel 2: Filtros y Búsqueda */}
      <div className="bg-white p-6 rounded-[24px] border border-stone-200 mb-8 flex flex-col md:flex-row gap-4 shadow-sm items-center">
        <SearchInput 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Buscar producto..." 
        />
        
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-stone-200 rounded-xl text-sm bg-white text-stone-600 focus:outline-none focus:border-ituka-green shadow-sm"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-stone-200 rounded-xl text-sm bg-white text-stone-600 focus:outline-none focus:border-ituka-green shadow-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="hidden">Ocultos</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando catálogo...</div>
        ) : products.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Package}
              title="No hay productos publicados."
              description="Pulsa Añadir producto para crear el primer producto de ITUKA."
              action={
                <ActionButton
                  onClick={() => { resetForm(); setModalOpen(true); }}
                  icon={Plus}
                  variant="primary"
                >
                  Añadir producto
                </ActionButton>
              }
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Search}
              title="No se encontraron productos"
              description="Intenta ajustar los filtros o crea un nuevo producto."
            />
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#FAFAF9]">
            {filteredProducts.map(product => {
              const category = String(product.category || '');
              const name = String(product.name || 'Producto');
              const statusText = product.isActive ? 'Activo' : 'Oculto';

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-[24px] border border-stone-200 shadow-sm hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] transition-all overflow-hidden group"
                >
                  <div className="relative h-44 bg-stone-50 border-b border-stone-100 overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-stone-300" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 bg-white/95 border border-stone-200 text-stone-500 hover:text-ituka-green hover:border-ituka-green/30 rounded-xl shadow-sm transition-colors"
                        title="Editar producto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(product)}
                        className="p-2 bg-white/95 border border-stone-200 text-stone-500 hover:text-stone-700 rounded-xl shadow-sm transition-colors"
                        title={product.isActive ? 'Ocultar producto' : 'Activar producto'}
                      >
                        {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`p-2 bg-white/95 border border-stone-200 rounded-xl shadow-sm transition-colors ${
                          product.isFeatured ? 'text-ituka-gold border-ituka-gold/30' : 'text-stone-400 hover:text-stone-600'
                        }`}
                        title={product.isFeatured ? 'Quitar destacado' : 'Destacar producto'}
                      >
                        <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-white/95 border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 rounded-xl shadow-sm transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ituka-text truncate">{name}</p>
                        {category && (
                          <p className="text-xs text-stone-400 font-medium mt-1 truncate">{category}</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide whitespace-nowrap ${
                        product.isActive
                          ? 'bg-[#E8F5E9] text-ituka-green border-green-200'
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-stone-700">${product.price}</p>
                      <p className={`text-xs font-bold ${Number(product.stock) < 5 ? 'text-red-500' : 'text-stone-500'}`}>
                        {product.stock} u.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100">
            <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-6">
              <h3 className="text-2xl font-serif font-bold text-ituka-text">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors p-2 hover:bg-stone-50 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Nombre del Producto</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all bg-[#F9F9F7]"
                  placeholder="Ej. Crema Hidratante"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Precio ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all bg-[#F9F9F7]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all bg-[#F9F9F7]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Categoría</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all bg-[#F9F9F7]"
                  placeholder="Ej. Facial, Corporal..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Descripción</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all h-32 resize-none bg-[#F9F9F7]"
                  placeholder="Describe el producto..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Ingredientes</label>
                <textarea
                  value={formData.ingredients}
                  onChange={e => setFormData({...formData, ingredients: e.target.value})}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all h-28 resize-none bg-[#F9F9F7]"
                  placeholder="Ej. Agua, glicerina, aloe vera..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Beneficios</label>
                <textarea
                  value={formData.benefits}
                  onChange={e => setFormData({...formData, benefits: e.target.value})}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all h-28 resize-none bg-[#F9F9F7]"
                  placeholder="Ej. Hidrata, calma, mejora la textura..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Imagen del producto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all bg-[#F9F9F7]"
                />
                {selectedImageFile && (
                  <p className="text-xs text-stone-400 mt-2 truncate">{selectedImageFile.name}</p>
                )}
                <div className="mt-3">
                  <label className="block text-xs font-bold text-stone-500 mb-2">URL de imagen (opcional)</label>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all bg-[#F9F9F7]"
                  placeholder="https://..."
                />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 text-ituka-green rounded border-stone-300 focus:ring-ituka-green cursor-pointer"
                    />
                    <span className="text-sm font-medium text-stone-700 group-hover:text-ituka-green transition-colors">Producto Visible</span>
                 </label>
                 
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-5 h-5 text-ituka-green rounded border-stone-300 focus:ring-ituka-green cursor-pointer"
                    />
                    <span className="text-sm font-medium text-stone-700 group-hover:text-ituka-green transition-colors">Destacado</span>
                 </label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-stone-100">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 text-stone-500 hover:bg-stone-50 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-ituka-green text-white rounded-xl hover:bg-[#3e4f22] font-bold shadow-lg shadow-ituka-green/20 transition-all hover:-translate-y-0.5"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
