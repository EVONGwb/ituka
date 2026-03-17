import { Link } from 'react-router-dom';

export default function ActionButton({ 
  children, 
  onClick, 
  to, 
  variant = 'primary', 
  icon: Icon,
  className = '' 
}) {
  const baseStyles = "ituka-btn";
  
  const variants = {
    primary: "ituka-btn-primary ring-1 ring-ituka-gold/15",
    gold: "ituka-btn-primary ring-1 ring-ituka-gold/15",
    olive: "ituka-btn-olive ring-1 ring-ituka-green/15",
    secondary: "ituka-btn-secondary",
    danger: "ituka-btn-danger ring-1 ring-ituka-danger/10"
  };

  const content = (
    <>
      {Icon && <Icon className="w-4 h-4 opacity-90" strokeWidth={1.5} />}
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
