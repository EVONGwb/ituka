import { Search, Bell, User } from 'lucide-react';

export default function Header({ user }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar productos, clientes, pedidos..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a25a]/20 focus:border-[#c5a25a] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-stone-400 hover:text-[#c5a25a] transition-colors rounded-full hover:bg-[#f6f3ec]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-stone-200 mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-stone-50 transition-colors cursor-pointer group">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-[#2f241b] group-hover:text-[#c5a25a] transition-colors">{user?.name || 'Admin'}</p>
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Administrador</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f1d99a] to-[#e0bd6a] flex items-center justify-center shadow-sm border-2 border-white">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
