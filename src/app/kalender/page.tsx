// === Kalender Akademik Interaktif — dengan Weekly Calendar View ===
"use client"

import { useState, useMemo } from "react"
import { PageTransition, FadeInUp } from "@/components/ui/motion"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid } from "lucide-react"
import { jadwalMingguanData } from "@/lib/mock-data"
import { WeeklyCalendar } from "@/components/dashboard/weekly-calendar"

// Event kalender (mock)
interface KalenderEvent {
  tanggal: number
  bulan: number
  tahun: number
  label: string
  type: "ujian" | "libur" | "deadline" | "kuliah"
}

const events: KalenderEvent[] = [
  { tanggal: 5, bulan: 3, tahun: 2026, label: "UTS Basis Data", type: "ujian" },
  { tanggal: 7, bulan: 3, tahun: 2026, label: "Deadline Tugas Web", type: "deadline" },
  { tanggal: 14, bulan: 3, tahun: 2026, label: "Libur Nasional", type: "libur" },
  { tanggal: 20, bulan: 3, tahun: 2026, label: "UTS Sistem Operasi", type: "ujian" },
  { tanggal: 1, bulan: 4, tahun: 2026, label: "Pembayaran UKT", type: "deadline" },
  { tanggal: 10, bulan: 4, tahun: 2026, label: "UAS Basis Data", type: "ujian" },
  { tanggal: 15, bulan: 4, tahun: 2026, label: "UAS Pemrograman Web", type: "ujian" },
  { tanggal: 21, bulan: 4, tahun: 2026, label: "Libur Kartini", type: "libur" },
  { tanggal: 25, bulan: 4, tahun: 2026, label: "Deadline Laporan PKL", type: "deadline" },
  { tanggal: 1, bulan: 5, tahun: 2026, label: "Libur Hari Buruh", type: "libur" },
]

const typeColor = {
  ujian: "bg-red-500",
  libur: "bg-green-500",
  deadline: "bg-orange-500",
  kuliah: "bg-blue-500",
}

const typeBg = {
  ujian: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  libur: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  deadline: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  kuliah: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

type ViewMode = "month" | "week"

export default function KalenderPage() {
  const today = new Date()
  const [bulan, setBulan] = useState(today.getMonth())
  const [tahun, setTahun] = useState(today.getFullYear())
  const [selected, setSelected] = useState<number | null>(today.getDate())
  const [viewMode, setViewMode] = useState<ViewMode>("month")

  // Tanggal-tanggal dalam bulan ini
  const { days, startDay } = useMemo(() => {
    const firstDay = new Date(tahun, bulan, 1).getDay()
    const daysInMonth = new Date(tahun, bulan + 1, 0).getDate()
    return { days: daysInMonth, startDay: firstDay }
  }, [bulan, tahun])

  // Event di hari yang dipilih
  const selectedEvents = useMemo(() => {
    if (!selected) return []
    return events.filter(
      (e) => e.tanggal === selected && e.bulan === bulan && e.tahun === tahun
    )
  }, [selected, bulan, tahun])

  // Event di bulan ini
  const monthEvents = useMemo(() => {
    return events.filter((e) => e.bulan === bulan && e.tahun === tahun)
  }, [bulan, tahun])

  // Jadwal kuliah di hari yang dipilih
  const hariDipilih = selected ? new Date(tahun, bulan, selected).getDay() : -1
  const hariStr = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][hariDipilih] || ""
  const jadwalHari = jadwalMingguanData.filter((j) => j.hari === hariStr)

  const prevMonth = () => {
    if (bulan === 0) { setBulan(11); setTahun(tahun - 1) }
    else setBulan(bulan - 1)
    setSelected(null)
  }

  const nextMonth = () => {
    if (bulan === 11) { setBulan(0); setTahun(tahun + 1) }
    else setBulan(bulan + 1)
    setSelected(null)
  }

  return (
    <PageTransition>
      <div className="pb-24 lg:pb-8">
        <PageHeader title="Kalender Akademik" />

        <div className="lg:px-10">
          {/* View Mode Toggle + Month Navigation */}
          <FadeInUp>
            <section className="px-5 pt-4 lg:px-0">
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-foreground">
                    {BULAN[bulan]} {tahun}
                  </h2>
                  {/* View toggle pills */}
                  <div className="hidden lg:flex items-center gap-1 rounded-full bg-muted/50 p-0.5">
                    <button
                      onClick={() => setViewMode("month")}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                        viewMode === "month"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <LayoutGrid size={11} />
                      Bulan
                    </button>
                    <button
                      onClick={() => setViewMode("week")}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                        viewMode === "week"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Calendar size={11} />
                      Minggu
                    </button>
                  </div>
                </div>
                <button onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* === Weekly Calendar View (desktop only) === */}
              {viewMode === "week" ? (
                <WeeklyCalendar />
              ) : (
                <>
                  {/* === Month Calendar Grid === */}
                  <div className="rounded-2xl border border-border/50 bg-card p-3 shadow-sm">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {HARI.map((h) => (
                        <div key={h} className="text-center text-[8px] font-bold uppercase tracking-wider text-muted-foreground py-1">
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Date cells */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Empty cells before first day */}
                      {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`e-${i}`} className="h-9" />
                      ))}

                      {/* Day cells */}
                      {Array.from({ length: days }).map((_, i) => {
                        const day = i + 1
                        const isToday = day === today.getDate() && bulan === today.getMonth() && tahun === today.getFullYear()
                        const isSelected = day === selected
                        const dayEvents = events.filter(
                          (e) => e.tanggal === day && e.bulan === bulan && e.tahun === tahun
                        )

                        return (
                          <button
                            key={day}
                            onClick={() => setSelected(day)}
                            className={`relative flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : isToday
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-foreground hover:bg-accent/30"
                            }`}
                          >
                            {day}
                            {/* Event dots */}
                            {dayEvents.length > 0 && (
                              <div className="absolute bottom-0.5 flex gap-0.5">
                                {dayEvents.slice(0, 3).map((e, idx) => (
                                  <div
                                    key={idx}
                                    className={`h-1 w-1 rounded-full ${typeColor[e.type]} ${
                                      isSelected ? "opacity-70" : ""
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-3 flex gap-3 justify-center">
                    {(["ujian", "deadline", "libur"] as const).map((t) => (
                      <div key={t} className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${typeColor[t]}`} />
                        <span className="text-[8px] font-bold uppercase text-muted-foreground capitalize">{t}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </FadeInUp>

          {/* === Desktop: Side-by-side calendar details === */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Selected day events */}
            {selected && viewMode === "month" && (
              <FadeInUp delay={0.1}>
                <section className="mx-5 mt-5 lg:mx-0">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {selected} {BULAN[bulan]} — {hariStr}
                  </h3>

                  {selectedEvents.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {selectedEvents.map((e, i) => (
                        <div key={i} className={`rounded-lg px-3 py-2 text-xs font-semibold ${typeBg[e.type]}`}>
                          {e.label}
                        </div>
                      ))}
                    </div>
                  )}

                  {jadwalHari.length > 0 ? (
                    <div className="space-y-2">
                      {jadwalHari.map((j) => (
                        <div key={j.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-all hover:shadow-md">
                          <div className={`h-2 w-2 rounded-full ${typeColor.kuliah}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground">{j.mataKuliah}</p>
                            <p className="text-[9px] text-muted-foreground">{j.jam} · {j.ruangan} · {j.dosen}</p>
                          </div>
                          <Badge variant="secondary" className="text-[7px] font-bold uppercase">{j.jenis}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    selectedEvents.length === 0 && (
                      <p className="text-xs text-muted-foreground/60 text-center py-4">
                        Tidak ada jadwal atau event di hari ini
                      </p>
                    )
                  )}
                </section>
              </FadeInUp>
            )}

            {/* Upcoming events */}
            <FadeInUp delay={0.15}>
              <section className="mx-5 mt-5 lg:mx-0">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Event Bulan Ini
                </h3>
                {monthEvents.length > 0 ? (
                  <div className="space-y-1.5">
                    {monthEvents.map((e, i) => (
                      <button
                        key={i}
                        onClick={() => { setViewMode("month"); setSelected(e.tanggal) }}
                        className="flex w-full items-center gap-3 rounded-lg border border-border/30 bg-card p-2.5 text-left transition-all hover:bg-accent/20 hover:shadow-sm"
                      >
                        <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-muted/50">
                          <span className="text-xs font-bold text-foreground">{e.tanggal}</span>
                          <span className="text-[7px] text-muted-foreground">{BULAN[e.bulan].substring(0, 3)}</span>
                        </div>
                        <span className="flex-1 text-[11px] font-semibold text-foreground">{e.label}</span>
                        <div className={`h-2 w-2 rounded-full ${typeColor[e.type]}`} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground/60 text-center py-4">
                    Tidak ada event di bulan ini
                  </p>
                )}
              </section>
            </FadeInUp>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
