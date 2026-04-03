// === Weekly Calendar View — Google Calendar-style ===
"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { jadwalMingguanData, type JadwalKuliah } from "@/lib/mock-data"

const HARI_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const HARI_FULL = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

// Warna per mata kuliah (konsisten)
const mkColors: Record<string, { bg: string; border: string; text: string }> = {
  "Basis Data": { bg: "bg-green-50 dark:bg-green-900/20", border: "border-l-green-500", text: "text-green-700 dark:text-green-400" },
  "Algoritma & Pemrograman": { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-l-blue-500", text: "text-blue-700 dark:text-blue-400" },
  "Pemrograman Web": { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-l-purple-500", text: "text-purple-700 dark:text-purple-400" },
  "Sistem Operasi": { bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-l-orange-500", text: "text-orange-700 dark:text-orange-400" },
  "Jaringan Komputer": { bg: "bg-cyan-50 dark:bg-cyan-900/20", border: "border-l-cyan-500", text: "text-cyan-700 dark:text-cyan-400" },
  "Matematika Diskrit": { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-l-amber-500", text: "text-amber-700 dark:text-amber-400" },
  "Struktur Data": { bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-l-rose-500", text: "text-rose-700 dark:text-rose-400" },
}

const defaultColor = { bg: "bg-muted/50", border: "border-l-primary", text: "text-foreground" }

// Parse jam string ke angka jam (contoh: "08.00 – 10.30" -> 8)
function parseStartHour(jam: string): number {
  const match = jam.match(/(\d+)\./)
  return match ? parseInt(match[1]) : 8
}

function parseEndHour(jam: string): number {
  const match = jam.match(/–\s*(\d+)\.(\d+)/)
  if (!match) return parseStartHour(jam) + 2
  const h = parseInt(match[1])
  const m = parseInt(match[2])
  return m > 0 ? h + 1 : h
}

// Jam range yang ditampilkan
const TIME_START = 8
const TIME_END = 18
const HOURS = Array.from({ length: TIME_END - TIME_START }, (_, i) => TIME_START + i)

export function WeeklyCalendar() {
  // Group jadwal per hari
  const jadwalPerHari = useMemo(() => {
    const map: Record<string, JadwalKuliah[]> = {}
    HARI_FULL.forEach((h) => { map[h] = [] })
    jadwalMingguanData.forEach((j) => {
      if (map[j.hari]) map[j.hari].push(j)
    })
    return map
  }, [])

  // Hari ini
  const todayIdx = new Date().getDay() // 0=Sun, 1=Mon...
  const todayHari = HARI_FULL[todayIdx - 1] // shift to Mon-based

  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      {/* Header row — day labels */}
      <div className="grid border-b border-border/50" style={{ gridTemplateColumns: "56px repeat(6, 1fr)" }}>
        {/* Time column header */}
        <div className="border-r border-border/30 bg-muted/20 p-2" />
        {HARI_LABELS.map((h, idx) => {
          const isToday = HARI_FULL[idx] === todayHari
          return (
            <div
              key={h}
              className={`border-r border-border/30 p-2 text-center last:border-r-0 ${
                isToday ? "bg-primary/5" : "bg-muted/20"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isToday ? "text-primary" : "text-muted-foreground"
              }`}>
                {h}
              </span>
              {isToday && (
                <div className="mx-auto mt-0.5 h-1 w-4 rounded-full bg-primary" />
              )}
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="relative grid" style={{ gridTemplateColumns: "56px repeat(6, 1fr)" }}>
        {/* Time labels column */}
        <div className="border-r border-border/30">
          {HOURS.map((hour) => (
            <div key={hour} className="flex h-14 items-start justify-end border-b border-border/20 pr-2 pt-0.5">
              <span className="text-[9px] font-semibold text-muted-foreground/60 tabular-nums">
                {hour.toString().padStart(2, "0")}.00
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {HARI_FULL.map((hari, dayIdx) => {
          const isToday = hari === todayHari
          const jadwal = jadwalPerHari[hari]

          return (
            <div key={hari} className={`relative border-r border-border/30 last:border-r-0 ${isToday ? "bg-primary/[0.02]" : ""}`}>
              {/* Hour grid lines */}
              {HOURS.map((hour) => (
                <div key={hour} className="h-14 border-b border-border/20" />
              ))}

              {/* Schedule blocks — positioned absolutely */}
              {jadwal.map((j) => {
                const startH = parseStartHour(j.jam)
                const endH = parseEndHour(j.jam)
                const top = (startH - TIME_START) * 56 // 56px = h-14
                const height = (endH - startH) * 56
                const color = mkColors[j.mataKuliah] || defaultColor

                return (
                  <div
                    key={j.id}
                    className={`absolute left-0.5 right-0.5 rounded-lg border-l-[3px] ${color.border} ${color.bg} p-1.5 overflow-hidden transition-all hover:shadow-md hover:z-10 cursor-pointer group`}
                    style={{ top: `${top}px`, height: `${height - 2}px` }}
                    title={`${j.mataKuliah} — ${j.jam} — ${j.ruangan}`}
                  >
                    <p className={`text-[10px] font-bold leading-tight truncate ${color.text}`}>
                      {j.mataKuliah}
                    </p>
                    <p className="text-[8px] text-muted-foreground mt-0.5 truncate">
                      {j.jam}
                    </p>
                    {height >= 100 && (
                      <p className="text-[8px] text-muted-foreground/70 mt-0.5 truncate">
                        {j.ruangan}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
