import { Link } from 'react-router-dom';

export default function StatCard({ label, value, icon: Icon, color, bg, link, trend, description }) {
  const CardContent = (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-stone-100 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 group relative h-full flex flex-col justify-between">
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-stone-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-300`}>
          <Icon className={`w-5 h-5 ${color} opacity-80`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-[32px] font-bold text-ituka-text leading-none tracking-tight mb-1">{value}</p>
        {description && <p className="text-xs text-stone-400 font-medium">{description}</p>}
      </div>
    </div>
  );

  if (link) {
    return <Link to={link} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}