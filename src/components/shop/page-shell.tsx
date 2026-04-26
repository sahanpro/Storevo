export function PageShell({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
