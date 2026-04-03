// === Activity Feed — Timeline aktivitas terbaru ===
"use client"

import { TrendingUp, UserCheck, CalendarClock, Megaphone } from "lucide-react"
import { activityFeedData, type ActivityItem } from "@/lib/mock-data"

const typeConfig: Record<ActivityItem["type"], {
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  dotColor: string
  borderColor: string
}> = {
  nilai: {
    icon: TrendingUp,
    color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
    dotColor: "bg-green-500",
    borderColor: "border-l-green-500",
  },
  kehadiran: {
    icon: UserCheck,
    color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
    dotColor: "bg-blue-500",
    borderColor: "border-l-blue-500",
  },
  deadline: {
    icon: CalendarClock,
    color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
    dotColor: "bg-orange-500",
    borderColor: "border-l-orange-500",
  },
  pengumuman: {
    icon: Megaphone,
    color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
    dotColor: "bg-purple-500",
    borderColor: "border-l-purple-500",
  },
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()

  // Future date
  if (diffMs < 0) {
    const futureDays = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24))
    if (futureDays === 1) return "Besok"
    return `${futureDays} hari lagi`
  }

  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays === 1) return "Kemarin"
  if (diffDays < 7) return `${diffDays} hari lalu`
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
}

export function ActivityFeed() {
  return (
    <div className="space-y-0">
      {activityFeedData.map((activity, idx) => {
        const config = typeConfig[activity.type]
        const Icon = config.icon
        const isLast = idx === activityFeedData.length - 1

        return (
          <div key={activity.id} className="flex gap-3 group">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center pt-1">
              <div className={`h-2.5 w-2.5 rounded-full ${config.dotColor} ring-4 ring-background shadow-sm transition-transform group-hover:scale-125`} />
              {!isLast && <div className="my-1 w-px flex-1 bg-border/60" />}
            </div>

            {/* Content card */}
            <div className={`flex-1 ${isLast ? "" : "pb-4"}`}>
              <div className={`rounded-xl border border-border/50 border-l-[3px] ${config.borderColor} bg-card p-3 shadow-sm transition-all hover:shadow-md hover:bg-accent/20`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                      <Icon size={13} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground leading-snug">{activity.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{activity.description}</p>
                    </div>
                  </div>
                  {activity.meta && (
                    <span className="shrink-0 rounded-md bg-muted/60 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                      {activity.meta}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 pl-9 text-[9px] font-semibold text-muted-foreground/50">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
