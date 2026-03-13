import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit, Trash, X, Eye, EyeOff, Star, Image as ImageIcon } from 'lucide-react';
import { SectionHeader, SearchInput, ActionButton, EmptyState, StatusBadge } from '../../components/admin/ui';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    imageUrl: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setModalOpen(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error al guardar producto');
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
      imageUrl: product.imageUrl || '',
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false
    });
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
      isActive: true,
      isFeatured: false
    });
  };

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && product.isActive) || 
                          (filterStatus === 'hidden' && !product.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Nivel 1: Título y Acción Principal */}
      <SectionHeader 
        title="Catálogo de Productos" 
        description="Gestiona inventario, visibilidad y destacados"
        action={
          <ActionButton 
            onClick={() => { resetForm(); setModalOpen(true); }} 
            icon={Plus}
            variant="primary"
          >
            Añadir Producto
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

      {/* Nivel 3: Tabla Visual */}
      <div className="bg-white rounded-[24px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
        <table className="w-full text-left">
          <thead className="bg-[#FAFAF9] text-stone-600 font-bold border-b border-stone-100 font-serif">
            <tr>
              <th className="p-6 pl-8 w-24">Img</th>
              <th className="p-6">Producto</th>
              <th className="p-6">Categoría</th>
              <th className="p-6">Estado</th>
              <th className="p-6 text-center">Destacado</th>
              <th className="p-6">Stock</th>
              <th className="p-6 text-right pr-8">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {loading && (
              <tr>
                <td colSpan="7" className="p-12 text-center text-stone-500">Cargando catálogo...</td>
              </tr>
            )}
            {!loading && filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7">
                  <EmptyState 
                    icon={Search} 
                    title="No se encontraron productos" 
                    description="Intenta ajustar los filtros o crea un nuevo producto."
                  />
                </td>
              </tr>
            )}
            {filteredProducts.map(product => (
              <tr key={product._id} className="hover:bg-[#FAFAF9] transition-colors group">
                <td className="p-6 pl-8">
                  <div className="w-16 h-16 rounded-xl bg-stone-50 border border-stone-100 overflow-hidden flex items-center justify-center shadow-sm">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-stone-300" />
                    )}
                  </div>
                </td>
                <td className="p-6">
                  <div className="font-bold text-ituka-text text-lg">{product.name}</div>
                  <div className="text-stone-500 text-sm font-semibold mt-1">${product.price}</div>
                </td>
                <td className="p-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-stone-50 text-stone-600 border border-stone-100 uppercase tracking-wide">
                    {product.category}
                  </span>
                </td>
                <td className="p-6">
                  <button 
                    onClick={() => toggleStatus(product)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      product.isActive 
                        ? 'bg-[#E8F5E9] text-ituka-green border border-green-200 hover:bg-green-100' 
                        : 'bg-stone-50 text-stone-500 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {product.isActive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-ituka-green"></span>
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        Oculto
                      </>
                    )}
                  </button>
                </td>
                <td className="p-6 text-center">
                  <button 
                    onClick={() => toggleFeatured(product)}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                      product.isFeatured 
                        ? 'text-ituka-gold bg-yellow-50 scale-110' 
                        : 'text-stone-300 hover:text-stone-400 hover:bg-stone-50'
                    }`}
                    title={product.isFeatured ? "Quitar destacado" : "Destacar"}
                  >
                    <Star className={`w-6 h-6 ${product.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                </td>
                <td className="p-6">
                  <span className={`text-sm font-bold ${product.stock < 5 ? 'text-red-500' : 'text-stone-600'}`}>
                    {product.stock} u.
                  </span>
                </td>
                <td className="p-6 text-right pr-8">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(product)} className="p-2.5 text-stone-400 hover:text-ituka-green hover:bg-[#E8F5E9] rounded-xl transition-colors" title="Editar">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Eliminar">
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                    required
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
                <label className="block text-sm font-bold text-stone-700 mb-2">URL Imagen</label>
                <input 
                  type="text" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-5 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green outline-none transition-all bg-[#F9F9F7]"
                  placeholder="https://..."
                />
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
