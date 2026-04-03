// === Halaman Detail Mata Kuliah ===
"use client"

import { use } from "react"
import { PageTransition, FadeInUp } from "@/components/ui/motion"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, User, Clock, MapPin, Calendar, Award, BarChart3 } from "lucide-react"
import { CatatanMK } from "@/components/dashboard/catatan-mk"
import { mataKuliahData, kehadiranData, jadwalMingguanData, getNilaiColor } from "@/lib/mock-data"

// Data detail nilai per komponen (mock)
const nilaiKomponen = [
  { nama: "Tugas 1", bobot: 10, nilai: 90 },
  { nama: "Tugas 2", bobot: 10, nilai: 85 },
  { nama: "Tugas 3", bobot: 10, nilai: 88 },
  { nama: "UTS", bobot: 30, nilai: 82 },
  { nama: "UAS", bobot: 30, nilai: 87 },
  { nama: "Kehadiran", bobot: 10, nilai: 93 },
]

export default function DetailMKPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = use(params)
  const mk = mataKuliahData.find((m) => m.kode === kode)
  const kehadiran = kehadiranData.find((k) => k.kode === kode)
  const jadwal = jadwalMingguanData.find((j) => j.kode === kode)

  if (!mk) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">Mata kuliah tidak ditemukan.</p>
      </div>
    )
  }

  const nilaiAkhir = nilaiKomponen.reduce((sum, k) => sum + (k.nilai * k.bobot) / 100, 0)

  return (
    <PageTransition>
      <div className="pb-24">
        <PageHeader title={mk.nama} />

        {/* Hero card */}
        <FadeInUp>
          <section className="mx-5 mt-5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 p-5 text-white shadow-lg shadow-green-500/20">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold">{mk.nama}</h2>
                <p className="text-[10px] opacity-80">{mk.kode} · {mk.sks} SKS · {mk.jenis}</p>
              </div>
              {mk.nilai && (
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${getNilaiColor(mk.nilai)}`}>
                  {mk.nilai}
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/20 pt-3">
              <div className="flex items-center gap-2">
                <User size={14} className="opacity-70" />
                <span className="text-[10px]">{mk.dosen}</span>
              </div>
              {jadwal && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="opacity-70" />
                    <span className="text-[10px]">{jadwal.hari}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="opacity-70" />
                    <span className="text-[10px]">{jadwal.jam}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="opacity-70" />
                    <span className="text-[10px]">{jadwal.ruangan}</span>
                  </div>
                </>
              )}
            </div>
          </section>
        </FadeInUp>

        {/* Kehadiran */}
        {kehadiran && (
          <FadeInUp delay={0.1}>
            <section className="mx-5 mt-5">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Kehadiran
              </h3>
              <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">{kehadiran.persentase}%</span>
                  <span className="text-[10px] text-muted-foreground">
                    {kehadiran.hadir}/{kehadiran.totalPertemuan} pertemuan
                  </span>
                </div>
                <Progress value={kehadiran.persentase} className="h-2" />
              </div>
            </section>
          </FadeInUp>
        )}

        {/* Komponen Nilai */}
        <FadeInUp delay={0.15}>
          <section className="mx-5 mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Komponen Nilai
              </h3>
              <Badge variant="outline" className="text-[9px] font-bold border-primary/30 text-primary">
                <BarChart3 size={10} className="mr-0.5" />
                Rata-rata: {nilaiAkhir.toFixed(1)}
              </Badge>
            </div>
            <div className="space-y-2">
              {nilaiKomponen.map((k) => {
                const color =
                  k.nilai >= 85 ? "bg-green-500" :
                  k.nilai >= 70 ? "bg-blue-500" :
                  k.nilai >= 55 ? "bg-amber-500" : "bg-red-500"

                return (
                  <div key={k.nama} className="rounded-xl border border-border/50 bg-card p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-foreground">{k.nama}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground">Bobot: {k.bobot}%</span>
                        <span className="text-xs font-bold text-foreground">{k.nilai}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${k.nilai}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </FadeInUp>

        {/* Catatan */}
        <FadeInUp delay={0.2}>
          <section className="mx-5 mt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Catatan Pribadi
              </h3>
              <CatatanMK kode={kode} namaMK={mk.nama} />
            </div>
          </section>
        </FadeInUp>
      </div>
    </PageTransition>
  )
}
