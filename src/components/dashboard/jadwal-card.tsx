// === Card jadwal mata kuliah ===
import { Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { JadwalKuliah } from "@/lib/mock-data"

interface JadwalCardProps {
  jadwal: JadwalKuliah
  isLast?: boolean
}

export function JadwalCard({ jadwal, isLast = false }: JadwalCardProps) {
  return (
    <div className="flex gap-3 group">
      {/* Timeline dot + garis */}
      <div className="flex flex-col items-center pt-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-transform group-hover:scale-125" />
        {!isLast && <div className="my-1 w-0.5 flex-1 bg-border" />}
      </div>

      {/* Konten jadwal */}
      <div className="flex-1 pb-5">
        <div className="rounded-xl border-l-[3px] border-l-primary/60 bg-primary/[0.03] p-3 transition-all duration-200 hover:bg-primary/[0.06] hover:shadow-md hover:-translate-y-0.5 lg:p-3.5">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">{jadwal.mataKuliah}</h4>
              <p className="text-[10px] font-medium text-muted-foreground">{jadwal.kode} · {jadwal.dosen}</p>
            </div>
            <Badge
              variant="secondary"
              className="ml-2 text-[9px] font-bold uppercase"
            >
              {jadwal.jenis}
            </Badge>
          </div>

          <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock size={11} />
              {jadwal.jam}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} />
              {jadwal.ruangan}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

