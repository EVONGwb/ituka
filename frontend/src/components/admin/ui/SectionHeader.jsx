export default function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-stone-100 pb-8">
      <div>
        <h2 className="text-[32px] font-serif font-bold text-ituka-text tracking-tight">{title}</h2>
        {description && <p className="text-stone-500 text-base mt-2 font-light max-w-2xl">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}