// === Halaman Akademik — daftar mata kuliah aktif dengan filter ===
"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, BookOpen, ChevronRight, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AkademikSkeleton } from "@/components/dashboard/akademik-skeleton"
import { IPSChart } from "@/components/dashboard/ips-chart"
import { ExportKHSButton } from "@/components/dashboard/export-khs"
import { KehadiranRadar, NilaiPieChart } from "@/components/dashboard/analytics"
import { mataKuliahData, mahasiswaData, getNilaiColor } from "@/lib/mock-data"

type FilterType = "semua" | "Teori" | "Praktikum"

export default function AkademikPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("semua")
  const mhs = mahasiswaData

  // Simulasi fetch data dari API (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Filter & search mata kuliah
  const filtered = useMemo(() => {
    return mataKuliahData.filter((mk) => {
      const matchSearch =
        mk.nama.toLowerCase().includes(search.toLowerCase()) ||
        mk.kode.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === "semua" || mk.jenis === filter
      return matchSearch && matchFilter
    })
  }, [search, filter])

  // Hitung total SKS yang difilter
  const totalSKS = filtered.reduce((sum, mk) => sum + mk.sks, 0)

  const filterTabs: { label: string; value: FilterType }[] = [
    { label: "Semua", value: "semua" },
    { label: "Teori", value: "Teori" },
    { label: "Praktikum", value: "Praktikum" },
  ]

  // Tampilkan skeleton saat loading
  if (isLoading) return <AkademikSkeleton />

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-5 pb-4 pt-14 backdrop-blur-xl lg:px-10 lg:pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground lg:text-2xl">Akademik</h1>
            <p className="text-xs text-muted-foreground">Semester {mhs.semester} · {mhs.prodi}</p>
          </div>
          <ExportKHSButton />
        </div>
      </header>

      <div className="lg:px-10">

      {/* Card ringkasan + Grafik IPS (side-by-side on desktop) */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:mt-5">
      <section className="mx-5 mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 p-5 text-white shadow-lg shadow-green-500/20 lg:mx-0 lg:mt-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold">{mhs.nama}</h2>
            <p className="text-[10px] opacity-80">{mhs.npm} · {mhs.prodi}</p>
          </div>
          <div className="rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm">
            Semester {mhs.semester}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/20 pt-3 text-center">
          <div>
            <p className="text-sm font-bold">{mhs.ipk.toFixed(2)}</p>
            <p className="text-[8px] opacity-70">IPK</p>
          </div>
          <div>
            <p className="text-sm font-bold">{mhs.ips.toFixed(2)}</p>
            <p className="text-[8px] opacity-70">IPS</p>
          </div>
          <div>
            <p className="text-sm font-bold">{mhs.sksLulus}</p>
            <p className="text-[8px] opacity-70">SKS Lulus</p>
          </div>
          <div>
            <p className="text-sm font-bold">{mhs.sksMaksimal - mhs.sksLulus}</p>
            <p className="text-[8px] opacity-70">SKS Sisa</p>
          </div>
        </div>
      </section>

      {/* Grafik IPS / IPK */}
      <section className="mx-5 mt-5 lg:mx-0 lg:mt-0">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Perkembangan IPS & IPK
        </h2>
        <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
          <IPSChart />
        </div>
      </section>
      </div>{/* end 2-col grid */}

      {/* Analytics — Radar kehadiran + Pie nilai */}
      <section className="mx-5 mt-5 grid grid-cols-2 gap-3 lg:mx-0 lg:grid-cols-4">
        <div>
          <h2 className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Kehadiran
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-2 shadow-sm">
            <KehadiranRadar />
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Distribusi Nilai
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-2 shadow-sm">
            <NilaiPieChart />
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="px-5 pt-5 lg:px-0">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mata kuliah..."
            className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Filter tabs */}
        <div className="mt-3 flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                filter === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto flex items-center text-[10px] font-bold text-muted-foreground">
            {filtered.length} MK · {totalSKS} SKS
          </span>
        </div>
      </section>

      {/* Daftar mata kuliah */}
      <section className="px-5 pt-4 space-y-2.5 lg:px-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {filtered.map((mk) => (
          <Link
            key={mk.kode}
            href={`/akademik/${mk.kode}`}
            className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-all duration-200 hover:bg-accent/20 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
          >
            {/* Badge nilai */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getNilaiColor(mk.nilai)}`}
            >
              {mk.nilai ?? "—"}
            </div>

            {/* Info MK */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">{mk.nama}</h3>
              <p className="text-[10px] text-muted-foreground">
                {mk.kode} · {mk.sks} SKS · Smt {mk.semester}
              </p>
              <p className="text-[10px] text-muted-foreground/70 truncate">{mk.dosen}</p>
            </div>

            {/* Jenis badge + chevron */}
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[8px] font-bold uppercase">
                {mk.jenis}
              </Badge>
              <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
            </div>
          </Link>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <GraduationCap size={48} className="mx-auto text-muted-foreground/20" />
            <h3 className="mt-3 text-sm font-bold text-muted-foreground">Tidak ditemukan</h3>
            <p className="mt-1 text-[10px] text-muted-foreground/60">Coba kata kunci atau filter lain</p>
          </div>
        )}
      </section>
      </div>{/* end lg:px-10 wrapper */}
    </div>
  )
}
