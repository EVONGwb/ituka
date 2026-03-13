import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="relative flex-1 w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-ituka-green/20 focus:border-ituka-green bg-[#F9F9F7]"
      />
    </div>
  );
}