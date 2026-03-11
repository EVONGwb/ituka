import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (formData.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-800">Crear Cuenta</h2>
          <p className="text-stone-500 mt-2">Únete a la comunidad ITUKA</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-stone-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
