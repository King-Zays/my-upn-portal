// === Breadcrumbs — navigasi desktop sub-halaman ===
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

// Mapping segment path ke label yang readable
const segmentLabels: Record<string, string> = {
  dashboard: "Beranda",
  layanan: "Layanan",
  akademik: "Akademik",
  kalender: "Kalender",
  notifikasi: "Notifikasi",
  profil: "Profil",
  jadwal: "Jadwal Kelas",
  kehadiran: "Kehadiran",
  pembayaran: "Pembayaran",
  login: "Login",
}

interface BreadcrumbItem {
  label: string
  href: string
  isLast: boolean
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Jangan tampilkan di halaman login, splash, atau halaman utama tanpa sub-path
  if (pathname === "/" || pathname === "/login") return null

  const segments = pathname.split("/").filter(Boolean)

  // Jangan tampilkan jika hanya 1 segment (halaman utama seperti /dashboard)
  if (segments.length <= 1) return null

  // Build breadcrumb items
  const items: BreadcrumbItem[] = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/")
    const isLast = idx === segments.length - 1

    // Check if it's a dynamic segment (e.g. course code like IF2301)
    const label = segmentLabels[seg] || seg.toUpperCase()

    return { label, href, isLast }
  })

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden lg:flex items-center gap-1.5 px-10 pt-4 pb-0"
    >
      {/* Home icon */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        <Home size={13} />
      </Link>

      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-muted-foreground/30" />
          {item.isLast ? (
            <span className="text-[11px] font-semibold text-foreground">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-[11px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
