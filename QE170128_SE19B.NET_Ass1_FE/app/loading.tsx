export default function Loading() {
  return (
    <div aria-label="Loading page" className="space-y-7 animate-pulse">
      <div className="space-y-3">
        <div className="h-3 w-24 rounded bg-slate-800" />
        <div className="h-8 w-64 max-w-full rounded bg-slate-800" />
        <div className="h-4 w-96 max-w-full rounded bg-slate-800/70" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-32 rounded-xl border border-slate-800 bg-slate-900" />)}
      </div>
      <div className="h-72 rounded-xl border border-slate-800 bg-slate-900" />
    </div>
  );
}