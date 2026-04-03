// === Sub-halaman kehadiran ===
"use client"

import { PageHeader } from "@/components/layout/page-header"
import { Progress } from "@/components/ui/progress"
import { kehadiranData } from "@/lib/mock-data"

export default function KehadiranPage() {
  // Rata-rata kehadiran
  const avgPercentage = Math.round(
    kehadiranData.reduce((sum, k) => sum + k.persentase, 0) / kehadiranData.length
  )

  return (
    <div className="pb-24">
      <PageHeader title="Kehadiran" subtitle="Rekap kehadiran semester ini" />

      {/* Rata-rata */}
      <section className="mx-5 mt-5 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 to-primary/5 p-5 text-center shadow-sm">
        <p className="text-xs font-semibold text-muted-foreground">Rata-rata Kehadiran</p>
        <p className="mt-1 font-heading text-4xl font-bold text-primary">{avgPercentage}%</p>
        <Progress value={avgPercentage} className="mt-3 h-2" />
      </section>

      {/* Daftar per mata kuliah */}
      <section className="px-5 pt-5 space-y-3">
        {kehadiranData.map((k) => {
          // Warna berdasarkan persentase
          const color =
            k.persentase >= 90
              ? "text-green-600 dark:text-green-400"
              : k.persentase >= 75
                ? "text-amber-600 dark:text-amber-400"
                : "text-destructive"

          return (
            <div
              key={k.kode}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground truncate">{k.mataKuliah}</h3>
                <p className="text-[10px] text-muted-foreground">
                  {k.kode} · {k.hadir}/{k.totalPertemuan} pertemuan
                </p>
                <Progress value={k.persentase} className="mt-2 h-1.5" />
              </div>
              <span className={`ml-4 font-heading text-lg font-bold tabular-nums ${color}`}>
                {k.persentase}%
              </span>
            </div>
          )
        })}
      </section>
    </div>
  )
}
