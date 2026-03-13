export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 bg-white rounded-[24px] border border-stone-100 flex flex-col items-center justify-center">
      <div className="bg-stone-50 p-6 rounded-full mb-4">
        <Icon className="w-12 h-12 text-stone-300" />
      </div>
      <h3 className="text-lg font-bold text-stone-600 mb-1">{title}</h3>
      <p className="text-stone-400 text-sm max-w-sm mx-auto mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}