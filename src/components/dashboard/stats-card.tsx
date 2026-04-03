// === Card statistik IPK / IPS / SKS ===
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  colorClass?: string
}

export function StatsCard({ label, value, icon, colorClass = "text-primary" }: StatsCardProps) {
  return (
    <div className="min-w-[120px] flex-shrink-0 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-200 active:scale-95 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 lg:min-w-0 lg:flex-1">
      <div className={cn("mb-2 flex h-9 w-9 items-center justify-center rounded-xl", colorClass.replace("text-", "bg-").split(" ")[0] + "/10")}>
        {icon}
      </div>
      <p className={cn("text-xl font-bold font-heading tabular-nums", colorClass)}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
