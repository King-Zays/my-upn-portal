// === Sub-halaman jadwal kelas mingguan ===
"use client"

import { PageHeader } from "@/components/layout/page-header"
import { JadwalCard } from "@/components/dashboard/jadwal-card"
import { jadwalMingguanData } from "@/lib/mock-data"

export default function JadwalPage() {
  // Kelompokkan jadwal per hari
  const hariOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
  const grouped = hariOrder
    .map((hari) => ({
      hari,
      jadwal: jadwalMingguanData.filter((j) => j.hari === hari),
    }))
    .filter((g) => g.jadwal.length > 0)

  return (
    <div className="pb-24">
      <PageHeader title="Jadwal Kelas" subtitle="Jadwal kuliah minggu ini" />

      <div className="px-5 pt-5 space-y-6">
        {grouped.map((group) => (
          <section key={group.hari}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {group.hari}
            </h2>
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
              {group.jadwal.map((j, idx) => (
                <JadwalCard key={j.id} jadwal={j} isLast={idx === group.jadwal.length - 1} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
