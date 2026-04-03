// === Header sub-halaman dengan tombol kembali ===
"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-5 pb-4 pt-14 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-heading text-lg font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  )
}
