import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Sparkles, Save, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
      country: user?.address?.country || ''
    },
    skinType: user?.skinType || '',
    skinNeeds: user?.skinNeeds || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="bg-ituka-surface rounded-3xl shadow-xl shadow-ituka-green/5 border border-ituka-border overflow-hidden">
        <div className="bg-ituka-ink p-8 text-ituka-cream flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
          <div className="relative z-10">
             <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
               <div className="bg-ituka-gold text-ituka-ink p-2 rounded-full">
                 <User className="w-6 h-6" />
               </div>
               Mi Perfil
             </h1>
             <p className="text-ituka-cream/60 mt-2 ml-14">Gestiona tu información personal y preferencias</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="relative z-10 flex items-center gap-2 bg-ituka-cream/10 hover:bg-ituka-cream/20 px-6 py-2 rounded-full transition border border-ituka-cream/20 font-medium"
          >
            {isEditing ? 'Cancelar' : <><Edit2 className="w-4 h-4" /> Editar</>}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 ${message.type === 'success' ? 'bg-ituka-success-soft text-ituka-success' : 'bg-ituka-danger-soft text-ituka-danger'}`}>
            {message.text}
          </div>
        )}


        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Información Personal */}
          <section>
            <h3 className="text-xl font-serif font-bold text-ituka-ink mb-6 border-b border-ituka-border pb-2">Información Personal</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ituka-gold" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ituka-gold" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ituka-gold" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Dirección */}
          <section>
            <h3 className="text-xl font-serif font-bold text-ituka-ink mb-6 border-b border-ituka-border pb-2">Dirección de Envío</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Calle y Número</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ituka-gold" />
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Ciudad</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Estado/Provincia</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Código Postal</label>
                <input
                  type="text"
                  name="address.zip"
                  value={formData.address.zip}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">País</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                />
              </div>
            </div>
          </section>

          {/* Perfil de Piel */}
          <section>
            <h3 className="text-xl font-serif font-bold text-ituka-ink mb-6 border-b border-ituka-border pb-2">Perfil de Piel</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Tipo de Piel</label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ituka-gold" />
                  <select
                    name="skinType"
                    value={formData.skinType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 appearance-none text-ituka-ink cursor-pointer"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="dry">Seca</option>
                    <option value="oily">Grasa</option>
                    <option value="mixed">Mixta</option>
                    <option value="sensitive">Sensible</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ituka-ink-muted mb-2">Necesidades Principales</label>
                <input
                  type="text"
                  name="skinNeeds"
                  value={formData.skinNeeds}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Ej: Hidratación, Anti-edad, Acné..."
                  className="w-full px-4 py-3 rounded-xl border border-ituka-border bg-ituka-cream-soft disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-ituka-gold/30 transition-all text-ituka-ink"
                />
              </div>
            </div>
          </section>

          {isEditing && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-ituka-gold text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-ituka-gold/90 transition-colors flex items-center gap-2 shadow-lg shadow-ituka-gold/20"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
