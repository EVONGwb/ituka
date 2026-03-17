import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    const redirectPath = user.role !== 'customer' ? '/admin' : '/dashboard';
    navigate(redirectPath, { replace: true });
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(identifier, password, rememberMe);
      if (user) {
        // Redirección segura basada en rol
        const redirectPath = user.role !== 'customer' ? '/admin' : '/dashboard';
        // Usar replace para evitar volver atrás al login
        navigate(redirectPath, { replace: true });
      } else {
        setError('Error desconocido al iniciar sesión');
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ituka-cream px-3 py-3 sm:px-5 sm:py-8 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-12rem] h-[24rem] w-[24rem] rounded-full bg-ituka-gold/18 blur-[80px]" />
        <div className="absolute right-[-8rem] bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-ituka-green/12 blur-[90px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="w-full rounded-[1.5rem] border border-ituka-border bg-white/95 px-4 py-4 sm:rounded-[2rem] sm:px-8 sm:py-10 shadow-[0_16px_40px_rgba(0,0,0,0.10)] backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <img
              src="/ituka-logo-transparent.png"
              alt="ITUKA Skin Care"
              className="w-24 sm:w-52 h-auto object-contain"
            />
            <h1 className="mt-1 sm:mt-4 text-3xl sm:text-5xl font-serif font-bold tracking-[0.04em] text-ituka-ink">ITUKA</h1>
            <p className="mt-1 text-[10px] sm:text-sm font-medium tracking-[0.35em] text-ituka-muted uppercase">Skin Care</p>
            <p className="hidden sm:block mt-3 sm:mt-5 text-sm sm:text-base leading-relaxed text-ituka-ink-muted">
              Belleza natural para tu piel
            </p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-ituka-muted">
              Inicia sesión con tu correo y contraseña
            </p>
          </div>

          {error ? (
            <div className="mt-2 sm:mt-6 rounded-xl border border-red-300 bg-red-50 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-2 sm:mt-6 space-y-2 sm:space-y-3">
            <div className="relative">
              <label htmlFor="identifier" className="sr-only">Correo electrónico o teléfono</label>
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-stone-500" />
              <input
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Correo electrónico o teléfono"
                className="w-full rounded-xl border border-ituka-border bg-ituka-surface px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-[16px] text-ituka-text placeholder:text-stone-500 outline-none transition focus:border-ituka-gold focus:ring-4 focus:ring-ituka-gold/25"
                autoComplete="username"
                inputMode="email"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-stone-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-xl border border-ituka-border bg-ituka-surface px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-[16px] text-ituka-text placeholder:text-stone-500 outline-none transition focus:border-ituka-gold focus:ring-4 focus:ring-ituka-gold/25"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer h-4 w-4 rounded border-gray-300 text-ituka-gold focus:ring-ituka-gold cursor-pointer"
                  />
                </div>
                <span className="text-sm text-stone-500 group-hover:text-stone-700 transition-colors">Recordar sesión</span>
              </label>

              <Link to="/forgot-password" className="text-sm text-ituka-gold font-medium hover:text-ituka-gold-shadow hover:underline underline-offset-4 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-ituka-gold bg-gradient-to-b from-ituka-gold-highlight to-ituka-gold px-4 py-2.5 sm:py-3.5 text-base sm:text-lg font-semibold text-ituka-ink transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ituka-gold/45 disabled:cursor-not-allowed disabled:opacity-65 shadow-md shadow-ituka-gold/20"
            >
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-3 sm:mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-ituka-border" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-ituka-muted">o</span>
            <div className="h-px flex-1 bg-ituka-border" />
          </div>

          <div className="mt-3 sm:mt-6 text-center text-xs sm:text-sm text-ituka-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-ituka-ink hover:underline">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
