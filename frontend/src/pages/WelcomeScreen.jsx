import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function WelcomeScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const user = await loginWithGoogle(tokenResponse);
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (err) {
        setError(err.message || 'Error al iniciar sesión con Google');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Error al conectar con Google'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(identifier, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f6f3ec] px-3 py-3 sm:px-5 sm:py-8 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10rem] top-[-12rem] h-[24rem] w-[24rem] rounded-full bg-[#d9b66b]/18 blur-[80px]" />
        <div className="absolute right-[-8rem] bottom-[-10rem] h-[22rem] w-[22rem] rounded-full bg-[#2f4f4f]/12 blur-[90px]" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="w-full rounded-[1.5rem] border border-[#d9cfbe] bg-white/95 px-4 py-4 sm:rounded-[2rem] sm:px-8 sm:py-10 shadow-[0_16px_40px_rgba(0,0,0,0.10)] backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <img
              src="/ituka-logo-transparent.png"
              alt="ITUKA Skin Care"
              className="w-24 sm:w-52 h-auto object-contain"
            />
            <h1 className="mt-1 sm:mt-4 text-3xl sm:text-5xl font-serif font-bold tracking-[0.04em] text-[#3b2e24]">ITUKA</h1>
            <p className="mt-1 text-[10px] sm:text-sm font-medium tracking-[0.35em] text-[#65584c] uppercase">Skin Care</p>
            <p className="hidden sm:block mt-3 sm:mt-5 text-sm sm:text-base leading-relaxed text-[#4d463f]">
              Belleza natural para tu piel
            </p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-[#6a6058]">
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
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#64748b]" />
              <input
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Correo electrónico o teléfono"
                className="w-full rounded-xl border border-[#d5d9df] bg-[#f9fafb] px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-[16px] text-[#111827] placeholder:text-[#6b7280] outline-none transition focus:border-[#a37f3e] focus:ring-4 focus:ring-[#d9b66b]/25"
                autoComplete="username"
                inputMode="email"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#64748b]" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-xl border border-[#d5d9df] bg-[#f9fafb] px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-[16px] text-[#111827] placeholder:text-[#6b7280] outline-none transition focus:border-[#a37f3e] focus:ring-4 focus:ring-[#d9b66b]/25"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] transition hover:text-[#374151]"
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-[#c5a25a] bg-[linear-gradient(180deg,#f1d99a_0%,#e0bd6a_100%)] px-4 py-2.5 sm:py-3.5 text-base sm:text-lg font-semibold text-[#2f241b] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d9b66b]/45 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {loading ? 'Iniciando sesión…' : 'Entrar ahora'}
            </button>
          </form>

          <div className="mt-2 sm:mt-4 text-center">
            <Link to="/forgot-password" className="text-xs sm:text-sm text-[#4d463f] underline underline-offset-4">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="mt-3 sm:mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#d9cfbe]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#807468]">o</span>
            <div className="h-px flex-1 bg-[#d9cfbe]" />
          </div>

          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="mt-3 sm:mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[#d5d9df] bg-white px-4 py-2.5 sm:py-3.5 text-sm sm:text-lg font-semibold text-[#2f241b] transition hover:bg-[#f8fafc]"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="sm:w-5 sm:h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.23 3.6l6.9-6.9C36.36 2.72 30.6 0 24 0 14.64 0 6.53 5.38 2.56 13.22l8.06 6.26C12.42 13.22 17.78 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.22-.43-4.75H24v9h12.6c-.54 2.9-2.17 5.36-4.62 7.02l7.05 5.47C43.87 36.25 46.5 30.63 46.5 24z"/>
              <path fill="#FBBC05" d="M10.62 28.52A14.5 14.5 0 0 1 9.86 24c0-1.57.27-3.1.76-4.52l-8.06-6.26A23.96 23.96 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l8.06-6.26z"/>
              <path fill="#34A853" d="M24 48c6.6 0 12.36-2.18 16.5-5.9l-7.05-5.47c-1.96 1.32-4.47 2.1-9.45 2.1-6.22 0-11.58-3.72-13.38-8.98l-8.06 6.26C6.53 42.62 14.64 48 24 48z"/>
            </svg>
            Continuar con Google
          </button>

          <Link
            to="/register"
            className="mt-2 sm:mt-4 block w-full rounded-xl border border-[#cbbda7] bg-white px-4 py-2.5 sm:py-3.5 text-center text-sm sm:text-lg font-semibold text-[#2f241b] transition hover:bg-[#f7f3eb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#cbbda7]/45"
          >
            Crear cuenta
          </Link>

          <div className="mt-3 sm:mt-6 text-center text-xs sm:text-sm text-[#5b524b]">
            ¿Ya tienes cuenta?{' '}
            <span className="font-semibold text-[#2f241b]">Puedes entrar desde aquí mismo</span>
          </div>
        </div>
      </div>
    </main>
  );
}
