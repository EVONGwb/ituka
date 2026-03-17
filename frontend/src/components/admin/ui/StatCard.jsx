import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon: Icon, color, bg, link, trend, description }) {
  const CardContent = (
    <div className="ituka-card ituka-card-hover p-7 transition-transform duration-300 hover:-translate-y-0.5 group relative h-full flex flex-col justify-between">
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3.5 rounded-2xl ${bg || 'bg-ituka-gold/10'} border border-ituka-border/60 shadow-ituka-inset group-hover:bg-ituka-gold/12 group-hover:border-ituka-gold/25 transition-all duration-300`}>
          <Icon className={`w-5 h-5 ${color || 'text-ituka-gold'} opacity-90`} strokeWidth={1.5} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${trend > 0 ? 'bg-ituka-success-soft text-ituka-success border-ituka-success/20' : 'bg-ituka-danger-soft text-ituka-danger border-ituka-danger/20'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-ituka-ink/45 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-[36px] font-bold text-ituka-text leading-none tracking-tight mb-1">{value}</p>
        {description && <p className="text-xs text-ituka-ink/45 font-medium">{description}</p>}
      </div>
    </div>
  );

  if (link) {
    return <Link to={link} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}
