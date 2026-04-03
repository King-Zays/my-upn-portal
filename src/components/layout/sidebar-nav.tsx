// === Sidebar Navigation — untuk tablet/laptop/desktop ===
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  LayoutGrid,
  BookOpen,
  User,
  Calendar,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { useState } from "react"
import { openCommandPalette } from "@/components/layout/command-palette"

interface SideNavItem {
  href: string
  labelKey: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  badge?: string
}

const mainNav: SideNavItem[] = [
  { href: "/dashboard", labelKey: "nav.beranda", icon: Home },
  { href: "/layanan", labelKey: "nav.layanan", icon: LayoutGrid },
  { href: "/akademik", labelKey: "nav.akademik", icon: BookOpen },
  { href: "/kalender", labelKey: "kal.title", icon: Calendar },
  { href: "/notifikasi", labelKey: "prof.notifikasi", icon: Bell, badge: "3" },
  { href: "/profil", labelKey: "nav.profil", icon: User },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)

  // Sembunyikan di halaman login & splash
  if (pathname === "/login" || pathname === "/") return null

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 hidden h-dvh border-r border-border/50 bg-card/80 backdrop-blur-xl transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b border-border/50 px-4",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 text-sm font-bold text-white shadow-md">
          M
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-foreground">MY UPN</h1>
            <p className="text-[9px] text-muted-foreground">Portal Mahasiswa</p>
          </div>
        )}
      </div>

      {/* Search button with ⌘K hint */}
      <div className={cn("border-b border-border/50 px-3 py-3", collapsed && "px-2")}>
        <button
          onClick={() => openCommandPalette()}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent/40 hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <Search size={16} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-xs">Cari...</span>
              <kbd className="rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            const label = t(item.labelKey)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon size={20} className={cn("shrink-0", isActive && "text-primary")} />
                  {!collapsed && <span>{label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[9px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip saat collapsed */}
                  {collapsed && (
                    <span className="absolute left-full ml-2 hidden rounded-lg bg-foreground/90 px-2.5 py-1 text-xs font-medium text-background shadow-lg group-hover:block z-[60]">
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border/50 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
