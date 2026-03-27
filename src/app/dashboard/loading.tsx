import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden font-sans antialiased text-slate-900">
      <div className="flex h-20 items-center justify-between px-8 bg-white border-b shrink-0">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20 opacity-50" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-[300px] border-r bg-white p-6 space-y-8">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-14 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="w-[420px] border-r bg-slate-50/30 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-white p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-6 w-3/4" />
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
