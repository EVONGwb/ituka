export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="ituka-card py-16 px-8 text-center flex flex-col items-center justify-center">
      <div className="bg-ituka-cream-soft p-6 rounded-full mb-4">
        <Icon className="w-12 h-12 text-ituka-ink/25" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-ituka-ink mb-1">{title}</h3>
      <p className="text-ituka-ink/45 text-sm max-w-sm mx-auto mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
