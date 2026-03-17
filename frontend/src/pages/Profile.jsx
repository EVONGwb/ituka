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
    <div className="min-h-screen bg-ituka-cream-soft font-sans py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[28px] shadow-ituka-card border border-ituka-border overflow-hidden">
          <div className="p-6 flex justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="w-1.5 self-stretch rounded-full bg-ituka-gold/70" />
              <div>
                <h1 className="text-3xl font-serif font-bold text-ituka-ink flex items-center gap-2">
                  <span className="w-10 h-10 rounded-2xl bg-ituka-cream-soft border border-ituka-border flex items-center justify-center">
                    <User className="w-5 h-5 text-ituka-ink" />
                  </span>
                  Perfil
                </h1>
                <p className="text-ituka-ink-muted mt-2">Gestiona tu información personal y preferencias</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-ituka-cream-soft hover:bg-ituka-cream px-5 py-2.5 rounded-2xl transition border border-ituka-border font-bold text-ituka-ink text-sm"
            >
              {isEditing ? 'Cancelar' : <><Edit2 className="w-4 h-4 text-ituka-gold" /> Editar</>}
            </button>
          </div>

        {message.text && (
          <div className={`p-4 ${message.type === 'success' ? 'bg-ituka-success-soft text-ituka-success' : 'bg-ituka-danger-soft text-ituka-danger'}`}>
            {message.text}
          </div>
        )}


        <form onSubmit={handleSubmit} className="p-6 space-y-10">
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
    </div>
  );
}
