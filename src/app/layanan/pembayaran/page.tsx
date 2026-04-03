// === Sub-halaman riwayat pembayaran ===
"use client"

import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { riwayatPembayaranData, formatRupiah } from "@/lib/mock-data"

export default function PembayaranPage() {
  // Total yang sudah dibayar
  const totalLunas = riwayatPembayaranData
    .filter((p) => p.status === "Lunas")
    .reduce((sum, p) => sum + p.nominal, 0)

  return (
    <div className="pb-24">
      <PageHeader title="Riwayat Pembayaran" subtitle="Status UKT & biaya lainnya" />

      {/* Total summary */}
      <section className="mx-5 mt-5 rounded-2xl border border-border/50 bg-card p-5 shadow-sm text-center">
        <p className="text-xs font-semibold text-muted-foreground">Total Pembayaran</p>
        <p className="mt-1 font-heading text-2xl font-bold text-foreground">{formatRupiah(totalLunas)}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {riwayatPembayaranData.filter((p) => p.status === "Lunas").length} dari {riwayatPembayaranData.length} pembayaran lunas
        </p>
      </section>

      {/* Daftar pembayaran */}
      <section className="px-5 pt-5 space-y-2.5">
        {riwayatPembayaranData.map((p) => {
          const statusColor: Record<string, string> = {
            Lunas: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            "Belum Lunas": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            Tertunda: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          }

          return (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm"
            >
              <div>
                <h3 className="text-sm font-bold text-foreground">{p.jenis}</h3>
                <p className="text-[10px] text-muted-foreground">
                  {p.tanggal === "-" ? "Belum dibayar" : p.tanggal}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums text-foreground">{formatRupiah(p.nominal)}</p>
                <Badge
                  variant="outline"
                  className={`mt-1 border-0 text-[8px] font-bold ${statusColor[p.status]}`}
                >
                  {p.status}
                </Badge>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
