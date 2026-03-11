import { Link } from 'react-router-dom';
import logoOnlyPng from '../assets/logo.png';

export default function ForgotPassword() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden bg-[#F5F5DC]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 18%, rgba(255,255,255,.72) 0%, rgba(245,245,220,0) 62%), radial-gradient(circle at 50% 92%, rgba(212,175,55,.10) 0%, rgba(245,245,220,0) 56%)'
      }}
    >
      <div
        className="absolute inset-0 opacity-45 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'120\' height=\'120\' filter=\'url(%23n)\' opacity=\'0.16\'/%3E%3C/svg%3E")'
        }}
      />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center text-center">
          <img src={logoOnlyPng} alt="ITUKA" className="w-44 h-auto object-contain mix-blend-multiply" />
          <h1 className="mt-4 text-3xl font-serif font-bold text-[#4A3626]">Recuperar contraseña</h1>
          <p className="mt-3 text-sm text-[#6E5E53]">
            Esta función estará disponible pronto.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm text-[#4A3626] font-semibold">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
