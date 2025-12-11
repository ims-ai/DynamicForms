interface FeatureCardProps {
  title: string;
  description: string;
  items?: string[];
}

export function FeatureCard({ title, description, items }: FeatureCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Schema-driven</span>
      </header>
      <p className="mb-3 text-sm text-slate-600">{description}</p>
      {items && (
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
