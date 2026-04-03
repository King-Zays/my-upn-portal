// === Dashboard Analytics — Radar kehadiran + Pie distribusi nilai ===
"use client"

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import { kehadiranData, mataKuliahData } from "@/lib/mock-data"

// === Radar Chart: Kehadiran per MK ===
const radarData = kehadiranData.map((k) => ({
  subject: k.mataKuliah.length > 12 ? k.mataKuliah.substring(0, 12) + "…" : k.mataKuliah,
  value: k.persentase,
  fullMark: 100,
}))

export function KehadiranRadar() {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--color-border, #e5e7eb)" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 7, fill: "var(--color-muted-foreground, #94a3b8)" }}
          />
          <Radar
            dataKey="value"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// === Pie Chart: Distribusi Nilai ===
const nilaiDistribusi = (() => {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, Lainnya: 0 }
  mataKuliahData.forEach((mk) => {
    if (!mk.nilai) return
    if (mk.nilai.startsWith("A")) counts["A"]++
    else if (mk.nilai.startsWith("B")) counts["B"]++
    else if (mk.nilai.startsWith("C")) counts["C"]++
    else counts["Lainnya"]++
  })
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))
})()

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border/50 bg-card px-2.5 py-1.5 shadow-lg text-xs">
      <span className="font-bold">{payload[0].name}: </span>
      <span>{payload[0].value} MK</span>
    </div>
  )
}

export function NilaiPieChart() {
  return (
    <div className="w-full h-[160px] flex items-center">
      <ResponsiveContainer width="55%" height="100%">
        <PieChart>
          <Pie
            data={nilaiDistribusi}
            cx="50%"
            cy="50%"
            outerRadius={55}
            innerRadius={30}
            dataKey="value"
            strokeWidth={2}
            stroke="var(--color-card, #fff)"
          >
            {nilaiDistribusi.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex-1 space-y-1.5">
        {nilaiDistribusi.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
            />
            <span className="text-[10px] text-foreground font-semibold">{item.name}</span>
            <span className="text-[9px] text-muted-foreground ml-auto">{item.value} MK</span>
          </div>
        ))}
      </div>
    </div>
  )
}
