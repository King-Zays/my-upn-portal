// === Skeleton untuk seluruh Dashboard — responsive desktop bento grid ===
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="pb-24 lg:pb-8 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-5 pb-4 pt-14 backdrop-blur-xl lg:px-10 lg:pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full lg:hidden" />
            <Skeleton className="h-10 w-10 rounded-xl lg:hidden" />
            <Skeleton className="hidden lg:block h-10 w-[180px] rounded-xl" />
          </div>
        </div>
      </header>

      <div className="lg:px-10">
        {/* Top Widgets: Semester + Countdown (2-col desktop) */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 lg:pt-4">
          <div className="px-5 pt-4 lg:px-0 lg:pt-0">
            <Skeleton className="h-[68px] w-full rounded-xl" />
          </div>
          <div className="px-5 pt-3 lg:px-0 lg:pt-0">
            <Skeleton className="h-[68px] w-full rounded-xl" />
          </div>
        </div>

        {/* Marquee skeleton */}
        <div className="px-5 pt-3 lg:px-0">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Stats skeleton — scroll mobile, grid desktop */}
        <div className="mt-5 px-5 lg:px-0">
          <Skeleton className="h-3 w-36 mb-3" />
          <div className="flex gap-3 overflow-hidden lg:grid lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[120px] flex-shrink-0 rounded-2xl border border-border/50 bg-card p-4 lg:min-w-0">
                <Skeleton className="h-9 w-9 rounded-xl mb-2" />
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-2 w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Bento: Jadwal + Pengumuman (2/3 + 1/3 on desktop) */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-6">
          {/* Jadwal skeleton (2/3) */}
          <div className="mt-6 px-5 lg:col-span-2 lg:mt-0 lg:px-0">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                    <div className="flex gap-3">
                      <Skeleton className="h-2.5 w-20" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pengumuman skeleton (1/3) */}
          <div className="mt-6 px-5 lg:col-span-1 lg:mt-0 lg:px-0">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border/50 bg-card p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-2 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed skeleton */}
        <div className="mt-6 px-5 lg:px-0">
          <Skeleton className="h-3 w-32 mb-3" />
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  {i < 3 && <div className="my-1 w-px flex-1 bg-border/30" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="rounded-xl border border-border/50 bg-card p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-2.5 w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick access skeleton */}
        <div className="mt-6 px-5 lg:px-0">
          <Skeleton className="h-3 w-20 mb-3" />
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/50 bg-card p-3.5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-2 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
