// === Komponen Marquee — teks pengumuman berjalan ===
"use client"

import { cn } from "@/lib/utils"

interface MarqueeProps {
  items: string[]
  className?: string
}

export function Marquee({ items, className }: MarqueeProps) {
  // Duplikasi item agar loop-nya seamless
  const duplicated = [...items, ...items]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-primary/10 bg-primary/5 px-3 py-2.5",
        className
      )}
    >
      <div className="animate-marquee flex gap-10 whitespace-nowrap hover:[animation-play-state:paused]">
        {duplicated.map((text, idx) => (
          <span
            key={idx}
            className="text-xs font-medium text-primary dark:text-green-400"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
