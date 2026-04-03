// === Countdown Widget — timer UAS, UTS, deadline ===
"use client"

import { useState, useEffect } from "react"
import { Clock, CalendarClock, AlertTriangle } from "lucide-react"

interface CountdownTarget {
  label: string
  date: Date
  type: "uas" | "uts" | "deadline"
}

// Data countdown (mock — tanggal relatif)
const targets: CountdownTarget[] = [
  {
    label: "UAS Semester 4",
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 hari dari sekarang
    type: "uas",
  },
  {
    label: "Deadline Tugas Web",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 hari dari sekarang
    type: "deadline",
  },
  {
    label: "UTS Semester 5",
    date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 hari
    type: "uts",
  },
]

function getTimeLeft(target: Date) {
  const now = new Date().getTime()
  const diff = target.getTime() - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  }
}

const typeConfig = {
  uas: { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", icon: AlertTriangle },
  uts: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30", icon: CalendarClock },
  deadline: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", icon: Clock },
}

export function CountdownWidget() {
  const [timeLefts, setTimeLefts] = useState(targets.map((t) => getTimeLeft(t.date)))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLefts(targets.map((t) => getTimeLeft(t.date)))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Ambil countdown terdekat yang belum expired
  const nearest = targets
    .map((t, i) => ({ ...t, ...timeLefts[i], index: i }))
    .filter((t) => !t.expired)
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0]

  if (!nearest) return null

  const config = typeConfig[nearest.type]
  const Icon = config.icon
  const isUrgent = nearest.days <= 3

  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all ${
      isUrgent 
        ? "border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-900/10 animate-pulse" 
        : "border-border/50 bg-card"
    }`}>
      {/* Icon */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
        <Icon size={18} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {isUrgent ? "⚡ Segera" : "Mendatang"}
        </p>
        <p className="text-xs font-bold text-foreground truncate">{nearest.label}</p>
      </div>

      {/* Timer */}
      <div className="flex gap-1 text-center">
        {[
          { val: nearest.days, unit: "H" },
          { val: nearest.hours, unit: "J" },
          { val: nearest.minutes, unit: "M" },
          { val: nearest.seconds, unit: "D" },
        ].map((item) => (
          <div key={item.unit} className="flex flex-col items-center">
            <span className={`text-sm font-bold font-mono tabular-nums ${isUrgent ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
              {String(item.val).padStart(2, "0")}
            </span>
            <span className="text-[7px] font-bold uppercase text-muted-foreground/60">
              {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
