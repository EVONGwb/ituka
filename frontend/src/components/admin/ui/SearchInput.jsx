import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = "Buscar...", className = '' }) {
  return (
    <div className="relative flex-1 w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ituka-ink/35" strokeWidth={1.5} />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`ituka-input pl-12 ${className}`}
      />
    </div>
  );
}
