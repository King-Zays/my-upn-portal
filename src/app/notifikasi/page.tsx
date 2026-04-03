// === Halaman Notifikasi ===
"use client"

import { useState } from "react"
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Bell, CreditCard, BookOpen, Megaphone, Check } from "lucide-react"
import { pengumumanData } from "@/lib/mock-data"

interface Notifikasi {
  id: string
  judul: string
  pesan: string
  waktu: string
  tipe: "akademik" | "keuangan" | "umum" | "sistem"
  dibaca: boolean
}

const notifikasiData: Notifikasi[] = [
  {
    id: "n1",
    judul: "Pembayaran UKT Berhasil",
    pesan: "Pembayaran UKT Semester 4 sebesar Rp3.500.000 telah dikonfirmasi.",
    waktu: "2 jam lalu",
    tipe: "keuangan",
    dibaca: false,
  },
  {
    id: "n2",
    judul: "Nilai Basis Data Diinput",
    pesan: "Dosen telah menginput nilai mata kuliah Basis Data (IF2301). Nilai: A",
    waktu: "5 jam lalu",
    tipe: "akademik",
    dibaca: false,
  },
  {
    id: "n3",
    judul: "KRS Semester 5 Dibuka",
    pesan: "Pengisian KRS untuk semester 5 telah dibuka. Batas akhir: 31 Juli 2026.",
    waktu: "1 hari lalu",
    tipe: "akademik",
    dibaca: true,
  },
  {
    id: "n4",
    judul: "Kuisioner LP3M",
    pesan: "Harap mengisi kuisioner evaluasi dosen sebelum 15 April 2026.",
    waktu: "2 hari lalu",
    tipe: "umum",
    dibaca: true,
  },
  {
    id: "n5",
    judul: "Maintenance Sistem",
    pesan: "SIAMIK akan mengalami maintenance pada 5 April 2026 pukul 00:00-06:00 WIB.",
    waktu: "3 hari lalu",
    tipe: "sistem",
    dibaca: true,
  },
  ...pengumumanData.map((p) => ({
    id: `pn-${p.id}`,
    judul: p.judul,
    pesan: p.isi,
    waktu: new Date(p.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
    tipe: p.kategori as Notifikasi["tipe"],
    dibaca: !p.penting,
  })),
]

const tipeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  akademik: { icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  keuangan: { icon: CreditCard, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
  umum: { icon: Megaphone, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  sistem: { icon: Bell, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
}

export default function NotifikasiPage() {
  const [notifs, setNotifs] = useState(notifikasiData)

  const unreadCount = notifs.filter((n) => !n.dibaca).length

  const tandaiSemua = () => {
    setNotifs(notifs.map((n) => ({ ...n, dibaca: true })))
  }

  const tandaiDibaca = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, dibaca: true } : n)))
  }

  return (
    <PageTransition>
      <div className="pb-24">
        <PageHeader title="Notifikasi" />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? (
              <><span className="font-bold text-foreground">{unreadCount}</span> belum dibaca</>
            ) : (
              "Semua sudah dibaca ✓"
            )}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={tandaiSemua}
              className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
            >
              <Check size={12} />
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* List notifikasi */}
        <StaggerContainer className="space-y-2 px-5">
          {notifs.map((n) => {
            const config = tipeConfig[n.tipe] || tipeConfig.umum
            const Icon = config.icon

            return (
              <StaggerItem key={n.id}>
                <button
                  onClick={() => tandaiDibaca(n.id)}
                  className={`w-full text-left flex gap-3 rounded-xl border p-3.5 shadow-sm transition-all hover:bg-accent/20 ${
                    n.dibaca
                      ? "border-border/30 bg-card opacity-70"
                      : "border-primary/20 bg-primary/[0.03]"
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-bold ${n.dibaca ? "text-muted-foreground" : "text-foreground"}`}>
                        {n.judul}
                      </h3>
                      {!n.dibaca && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{n.pesan}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge variant="secondary" className="text-[8px] font-bold uppercase">
                        {n.tipe}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground/60">{n.waktu}</span>
                    </div>
                  </div>
                </button>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}
