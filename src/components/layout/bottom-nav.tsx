// === Bottom Navigation — navigasi utama mobile MY UPN ===
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

interface NavItem {
  href: string
  labelKey: string
  icon: React.ComponentType<{ className?: string; size?: number }>
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "nav.beranda", icon: Home },
  { href: "/layanan", labelKey: "nav.layanan", icon: LayoutGrid },
  { href: "/akademik", labelKey: "nav.akademik", icon: BookOpen },
  { href: "/profil", labelKey: "nav.profil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  // Sembunyikan navigasi di halaman login
  if (pathname === "/login" || pathname === "/") return null

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 lg:hidden"
      role="navigation"
      aria-label="Menu utama"
    >
      {/* Gradient fade di atas nav */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="mx-3 mb-3 flex items-center justify-around rounded-2xl border border-border/50 bg-background/80 px-2 py-1 shadow-lg backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          const label = t(item.labelKey)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-[10px] font-semibold transition-all duration-200 active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute -top-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-primary" />
              )}
              <Icon size={22} className={cn("transition-all", isActive && "scale-110")} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
