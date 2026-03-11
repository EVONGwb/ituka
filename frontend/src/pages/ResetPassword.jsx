import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f3ec] px-4 py-6 flex items-center justify-center">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-12rem] h-[24rem] w-[24rem] rounded-full bg-[#d9b66b]/10 blur-[80px]" />
        <div className="absolute right-[-8rem] bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-[#2f4f4f]/10 blur-[90px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="w-full rounded-[2rem] border border-[#d9cfbe] bg-white/95 px-5 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.05)] backdrop-blur sm:px-10 sm:py-12">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src="/ituka-logo-transparent.png"
              alt="ITUKA Skin Care"
              className="w-24 sm:w-32 h-auto object-contain mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3b2e24] tracking-wide">Nueva contraseña</h2>
            <p className="text-[#6a6058] mt-3 text-sm leading-relaxed">
              Introduce tu nueva contraseña segura.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center animate-fade-in">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center animate-fade-in space-y-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#3b2e24]">¡Contraseña actualizada!</h3>
              <p className="text-[#6a6058] text-sm">
                Tu contraseña ha sido cambiada correctamente. <br/>
                Redirigiendo al inicio de sesión...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#6a6058] uppercase tracking-wider ml-1">Nueva contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af] group-focus-within:text-[#c5a25a] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#c5a25a] focus:ring-4 focus:ring-[#c5a25a]/10 focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#6a6058] uppercase tracking-wider ml-1">Confirmar contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af] group-focus-within:text-[#c5a25a] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] text-[#1f2937] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#c5a25a] focus:ring-4 focus:ring-[#c5a25a]/10 focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-b from-[#f1d99a] to-[#e0bd6a] text-[#2f241b] py-4 rounded-xl font-bold text-lg hover:brightness-105 active:scale-[0.98] transition-all shadow-md shadow-[#d9b66b]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#2f241b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </span>
                ) : (
                  'Actualizar contraseña'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
