// === Grid akses cepat ke layanan ===
"use client"

import Link from "next/link"
import {
  Clock, CheckSquare, CreditCard, ClipboardList, CalendarDays, Award
} from "lucide-react"

interface QuickItem {
  label: string
  icon: React.ReactNode
  href: string
  color: string
}

const quickItems: QuickItem[] = [
  { label: "Jadwal", icon: <Clock size={20} />, href: "/layanan/jadwal", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { label: "Kehadiran", icon: <CheckSquare size={20} />, href: "/layanan/kehadiran", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "Bayar", icon: <CreditCard size={20} />, href: "/layanan/pembayaran", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { label: "KHS", icon: <Award size={20} />, href: "#", color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { label: "Kalender", icon: <CalendarDays size={20} />, href: "#", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  { label: "LP3M", icon: <ClipboardList size={20} />, href: "#", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
]

export function QuickAccess() {
  return (
    <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
      {quickItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/50 bg-card p-3.5 shadow-sm transition-all duration-200 active:scale-95 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
            {item.icon}
          </div>
          <span className="text-[10px] font-bold text-foreground">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}
