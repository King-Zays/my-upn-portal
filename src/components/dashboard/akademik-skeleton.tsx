// === Skeleton untuk halaman Akademik ===
import { Skeleton } from "@/components/ui/skeleton"

export function AkademikSkeleton() {
  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-5 pb-4 pt-14 backdrop-blur-xl">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-3 w-40 mt-1.5" />
      </header>

      {/* Green card skeleton */}
      <div className="mx-5 mt-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-700/20 p-5">
        <Skeleton className="h-5 w-40 bg-white/20" />
        <Skeleton className="h-3 w-56 mt-1 bg-white/10" />
        <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="h-4 w-10 mx-auto bg-white/20" />
              <Skeleton className="h-2 w-6 mx-auto bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pt-5">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="mt-3 flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Course list */}
      <div className="px-5 pt-4 space-y-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5">
            <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
              <Skeleton className="h-2 w-2/3" />
            </div>
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
