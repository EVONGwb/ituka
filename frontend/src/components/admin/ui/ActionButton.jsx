import { Link } from 'react-router-dom';

export default function ActionButton({ 
  children, 
  onClick, 
  to, 
  variant = 'primary', 
  icon: Icon,
  className = '' 
}) {
  const baseStyles = "flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] border border-transparent";
  
  const variants = {
    primary: "bg-ituka-green text-white hover:bg-[#4a5e29] ring-1 ring-ituka-green/10",
    secondary: "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-100",
    gold: "bg-ituka-gold text-white hover:bg-[#b08d45] ring-1 ring-ituka-gold/10"
  };

  const content = (
    <>
      {Icon && <Icon className="w-4 h-4 opacity-90" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {content}
    </button>
  );
}