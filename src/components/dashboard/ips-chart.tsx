// === Grafik riwayat IPS/IPK per semester dengan Recharts ===
"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { riwayatIPSData } from "@/lib/mock-data"

// Custom tooltip yang matching style MY UPN
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border/50 bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-semibold">
          {entry.name}: {entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  )
}

export function IPSChart() {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={riwayatIPSData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border, #e5e7eb)"
            opacity={0.5}
          />
          <XAxis
            dataKey="semester"
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground, #94a3b8)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[2.5, 4.0]}
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground, #94a3b8)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={6}
            wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
          />
          <Line
            type="monotone"
            dataKey="ips"
            name="IPS"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="ipk"
            name="IPK"
            stroke="#3b82f6"
            strokeWidth={2.5}
            strokeDasharray="5 3"
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
