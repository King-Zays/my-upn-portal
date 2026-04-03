// === Global Search — trigger button untuk Command Palette ===
"use client"

import { Search } from "lucide-react"
import { openCommandPalette } from "@/components/layout/command-palette"

export function GlobalSearch() {
  return (
    <button
      onClick={() => openCommandPalette()}
      aria-label="Cari (Ctrl+K)"
      className="flex h-10 items-center gap-2 rounded-xl border border-border/50 bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 px-3 lg:min-w-[180px]"
    >
      <Search size={16} className="shrink-0" />
      <span className="hidden text-xs text-muted-foreground/60 lg:inline">
        Cari...
      </span>
      <kbd className="ml-auto hidden rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground lg:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
