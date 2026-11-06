export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border rounded-[1.5rem] overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}