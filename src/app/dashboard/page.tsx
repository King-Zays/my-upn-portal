// === Halaman Dashboard MY UPN ===
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Award, BookOpen, TrendingUp, GraduationCap } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion"
import { StatsCard } from "@/components/dashboard/stats-card"
import { JadwalCard } from "@/components/dashboard/jadwal-card"
import { PengumumanItem } from "@/components/dashboard/pengumuman-item"
import { QuickAccess } from "@/components/dashboard/quick-access"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { GlobalSearch } from "@/components/layout/global-search"
import { useConfetti } from "@/hooks/use-confetti"
import { CountdownWidget } from "@/components/dashboard/countdown-widget"
import { usePullToRefresh, PullIndicator } from "@/hooks/use-pull-refresh"
import {
  mahasiswaData,
  jadwalHariIni,
  pengumumanData,
  marqueeTexts,
  getGreeting,
  getGreetingEmoji,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulasi fetch data dari API (600ms)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const mhs = mahasiswaData
  const greeting = getGreeting()
  const emoji = getGreetingEmoji()

  // Inisial nama untuk avatar
  const initials = mhs.nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  // Progress semester (minggu ke-N dari 16 minggu)
  const totalWeeks = 16
  const currentWeek = 12
  const semesterProgress = Math.round((currentWeek / totalWeeks) * 100)

  // 🎉 Confetti jika IPK >= 3.5
  useConfetti(mhs.ipk)

  // Pull to refresh
  const { isRefreshing, pullDistance, threshold } = usePullToRefresh()

  // Tampilkan skeleton saat loading
  if (isLoading) return <DashboardSkeleton />

  return (
    <PageTransition>
      <PullIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} threshold={threshold} />
      <div className="pb-24 lg:pb-8">
        {/* === Header === */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-5 pb-4 pt-14 backdrop-blur-xl lg:px-10 lg:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {greeting} {emoji}
              </p>
              <h1 className="font-heading text-xl font-bold text-foreground lg:text-2xl">
                {mhs.nama.split(" ")[0]}
              </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* Avatar — hidden di desktop karena ada sidebar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-xs font-bold text-white shadow-md lg:hidden">
                {initials}
              </div>
              {/* Global Search */}
              <GlobalSearch />
              {/* Notifikasi — hidden di desktop (sudah ada di sidebar) */}
              <Link
                href="/notifikasi"
                aria-label="Notifikasi"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 lg:hidden"
              >
                <Bell size={18} aria-hidden="true" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-card bg-destructive" />
              </Link>
            </div>
          </div>
        </header>

        {/* === Content area with consistent padding === */}
        <div className="lg:px-10">

        {/* === Top Widgets: Semester + Countdown (2-col on desktop) === */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 lg:pt-4">
          {/* === Semester Progress === */}
          <FadeInUp>
            <section className="px-5 pt-4 lg:px-0 lg:pt-0">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-11 w-11">
                    <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                      <circle
                        cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3"
                        className="text-primary"
                        strokeDasharray={`${semesterProgress * 1.131} 113.1`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
                      {semesterProgress}%
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Semester {mhs.semester}</p>
                    <p className="text-[10px] text-muted-foreground">Minggu ke-{currentWeek} dari {totalWeeks}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-primary">{totalWeeks - currentWeek} minggu lagi</p>
                  <p className="text-[9px] text-muted-foreground">hingga UAS</p>
                </div>
              </div>
            </section>
          </FadeInUp>

          {/* === Countdown Deadline === */}
          <FadeInUp delay={0.03}>
            <section className="px-5 pt-3 lg:px-0 lg:pt-0">
              <CountdownWidget />
            </section>
          </FadeInUp>
        </div>

        {/* === Marquee Pengumuman === */}
        <FadeInUp delay={0.05}>
          <section className="px-5 pt-3 lg:px-0">
            <Marquee items={marqueeTexts} />
          </section>
        </FadeInUp>

        {/* === Stats Grid (scroll mobile, grid desktop) === */}
        <FadeInUp delay={0.1}>
          <section className="mt-5 px-5 lg:px-0">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Ringkasan Akademik
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
              <StatsCard
                label="IPK"
                value={mhs.ipk.toFixed(2)}
                icon={<Award size={18} className="text-green-600 dark:text-green-400" />}
                colorClass="text-green-600 dark:text-green-400"
              />
              <StatsCard
                label="IPS"
                value={mhs.ips.toFixed(2)}
                icon={<TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />}
                colorClass="text-blue-600 dark:text-blue-400"
              />
              <StatsCard
                label="SKS Lulus"
                value={mhs.sksLulus}
                icon={<BookOpen size={18} className="text-orange-600 dark:text-orange-400" />}
                colorClass="text-orange-600 dark:text-orange-400"
              />
              <StatsCard
                label="Semester"
                value={mhs.semester}
                icon={<GraduationCap size={18} className="text-purple-600 dark:text-purple-400" />}
                colorClass="text-purple-600 dark:text-purple-400"
              />
            </div>
          </section>
        </FadeInUp>

        {/* === Bento: Jadwal + Pengumuman (2-col on desktop) === */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-6">
          {/* === Jadwal Hari Ini (2/3 width) === */}
          <FadeInUp delay={0.15}>
            <section className="mt-6 px-5 lg:col-span-2 lg:mt-0 lg:px-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Jadwal Hari Ini
                </h2>
                <span className="text-[10px] font-bold text-primary">{jadwalHariIni.length} Kelas</span>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                {jadwalHariIni.map((jadwal, idx) => (
                  <JadwalCard
                    key={jadwal.id}
                    jadwal={jadwal}
                    isLast={idx === jadwalHariIni.length - 1}
                  />
                ))}
              </div>
            </section>
          </FadeInUp>

          {/* === Pengumuman Terbaru (1/3 width) === */}
          <FadeInUp delay={0.25}>
            <section className="mt-6 px-5 lg:col-span-1 lg:mt-0 lg:px-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Pengumuman
                </h2>
                <Link href="/notifikasi" className="text-[10px] font-bold uppercase text-primary hover:underline">
                  Lihat Semua
                </Link>
              </div>

              <StaggerContainer className="space-y-2.5">
                {pengumumanData.slice(0, 3).map((p) => (
                  <StaggerItem key={p.id}>
                    <PengumumanItem pengumuman={p} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </FadeInUp>
        </div>

        {/* === Activity Feed === */}
        <FadeInUp delay={0.2}>
          <section className="mt-6 px-5 lg:px-0">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Aktivitas Terbaru
            </h2>
            <ActivityFeed />
          </section>
        </FadeInUp>

        {/* === Quick Access === */}
        <FadeInUp delay={0.25}>
          <section className="mt-6 px-5 lg:px-0">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Akses Cepat
            </h2>
            <QuickAccess />
          </section>
        </FadeInUp>

        </div>{/* end lg:px-10 wrapper */}
      </div>
    </PageTransition>
  )
}
