// === Item pengumuman untuk dashboard ===
import { Badge } from "@/components/ui/badge"
import type { Pengumuman } from "@/lib/mock-data"

interface PengumumanItemProps {
  pengumuman: Pengumuman
}

export function PengumumanItem({ pengumuman }: PengumumanItemProps) {
  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  // Warna badge berdasarkan kategori
  const kategoriColor: Record<string, string> = {
    akademik: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    keuangan: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    umum: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  }
  // Warna border kiri berdasarkan kategori
  const borderColor: Record<string, string> = {
    akademik: "border-l-blue-500",
    keuangan: "border-l-amber-500",
    umum: "border-l-gray-400",
  }

  return (
    <div className={`flex gap-3 rounded-xl border border-border/50 border-l-[3px] ${borderColor[pengumuman.kategori] || "border-l-gray-400"} bg-card p-3.5 transition-all duration-200 hover:bg-accent/30 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20`}>
      {/* Indikator penting */}
      <div className="mt-0.5 flex flex-col items-center">
        <div
          className={`h-2 w-2 rounded-full ${
            pengumuman.penting ? "bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.5)]" : "bg-muted-foreground/30"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2">
            {pengumuman.judul}
          </h4>
          <Badge variant="outline" className={`shrink-0 text-[8px] font-bold uppercase border-0 ${kategoriColor[pengumuman.kategori]}`}>
            {pengumuman.kategori}
          </Badge>
        </div>
        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground line-clamp-2">
          {pengumuman.isi}
        </p>
        <p className="mt-1.5 text-[9px] font-semibold text-muted-foreground/60">
          {formatDate(pengumuman.tanggal)}
        </p>
      </div>
    </div>
  )
}
