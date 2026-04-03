// === Halaman Profil Mahasiswa ===
"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  User, Shield, Bell, Info, Settings, LogOut,
  ChevronRight, Moon, Sun, ExternalLink, Check
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageTransition, FadeInUp } from "@/components/ui/motion"
import { toast } from "sonner"
import { AvatarUpload } from "@/components/dashboard/avatar-upload"
import { AchievementSection } from "@/components/dashboard/achievements"
import { useI18n } from "@/lib/i18n"
import { mahasiswaData, sistemTerhubungData } from "@/lib/mock-data"

export default function ProfilPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const mhs = mahasiswaData

  // Inisial untuk avatar
  const initials = mhs.nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  // Menu pengaturan
  const menuItems = [
    { id: "edit", label: "Edit Profil", icon: User, color: "text-blue-500" },
    { id: "password", label: "Ganti Password", icon: Shield, color: "text-purple-500" },
    { id: "notif", label: "Notifikasi", icon: Bell, color: "text-orange-500" },
    { id: "help", label: "Pusat Bantuan", icon: Info, color: "text-green-500" },
    { id: "about", label: "Tentang Aplikasi", icon: Settings, color: "text-gray-500", value: "v4.0.0" },
  ]

  const { locale, setLocale, t } = useI18n()

  // Logout — hapus sesi & redirect
  const handleLogout = () => {
    toast.info("Anda telah keluar dari akun.")
    router.push("/login")
  }

  // Language toggle row
  function LanguageRow() {
    return (
      <button
        onClick={() => setLocale(locale === "id" ? "en" : "id")}
        className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-accent/30 active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <span className="text-sm">{locale === "id" ? "🇮🇩" : "🇬🇧"}</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{t("umum.bahasa")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold ${locale === "id" ? "text-primary" : "text-muted-foreground"}`}>ID</span>
          <div className={`relative h-6 w-11 rounded-full transition-colors ${locale === "en" ? "bg-primary" : "bg-muted"}`}>
            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${locale === "en" ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className={`text-[10px] font-bold ${locale === "en" ? "text-primary" : "text-muted-foreground"}`}>EN</span>
        </div>
      </button>
    )
  }

  return (
    <PageTransition>
    <div className="pb-28 lg:pb-8">
      {/* Hero profil */}
      <section className="relative pb-8 pt-20 text-center">
        {/* Background dekorasi */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/8 to-transparent" />

        {/* Avatar */}
        <AvatarUpload initials={initials} />

        {/* Nama & info */}
        <h2 className="mt-4 font-heading text-xl font-bold text-foreground lg:text-2xl">{mhs.nama}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{mhs.npm}</p>
        <p className="text-[10px] text-muted-foreground">{mhs.email}</p>

        {/* Status badges */}
        <div className="mt-3 flex justify-center gap-2">
          <Badge variant="outline" className="border-green-200 bg-green-50 text-[10px] font-bold text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            {mhs.status}
          </Badge>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Semester {mhs.semester}
          </Badge>
          <Badge variant="outline" className="border-purple-200 bg-purple-50 text-[10px] font-bold text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
            {mhs.prodi}
          </Badge>
        </div>
      </section>

      <div className="lg:px-10">

      {/* Info akademik ringkas */}
      <FadeInUp>
      <section className="mx-5 mb-6 grid grid-cols-3 gap-2.5 lg:mx-0 lg:grid-cols-4">
        {[
          { label: "IPK", value: mhs.ipk.toFixed(2) },
          { label: "SKS Lulus", value: mhs.sksLulus.toString() },
          { label: "Angkatan", value: mhs.angkatan.toString() },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border/50 bg-card p-3 text-center shadow-sm">
            <p className="font-heading text-lg font-bold text-foreground">{item.value}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </section>
      </FadeInUp>

      {/* Achievement Badges */}
      <FadeInUp delay={0.03}>
        <AchievementSection />
      </FadeInUp>

      {/* Toggles: Dark mode + Language (side by side on desktop) */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-4">
      <FadeInUp delay={0.05}>
      <section className="mx-5 mb-4 lg:mx-0">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-accent/30 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <span className="text-sm font-semibold text-foreground">Mode Gelap</span>
          </div>
          <div className={`relative h-6 w-11 rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-muted"}`}>
            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
        </button>
      </section>
      </FadeInUp>

      {/* Language toggle */}
      <FadeInUp delay={0.06}>
      <section className="mx-5 mb-4 lg:mx-0">
        <LanguageRow />
      </section>
      </FadeInUp>
      </div>{/* end 2-col toggles */}

      {/* Menu pengaturan */}
      <FadeInUp delay={0.1}>
      <section className="mx-5 mb-6 lg:mx-0">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Akun & Pengaturan
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm divide-y divide-border/50">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className="flex w-full items-center justify-between p-4 transition-colors hover:bg-accent/20 active:bg-accent/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.value && (
                    <span className="text-[10px] font-bold text-muted-foreground">{item.value}</span>
                  )}
                  <ChevronRight size={16} className="text-muted-foreground/30" />
                </div>
              </button>
            )
          })}
        </div>
      </section>
      </FadeInUp>

      {/* Sistem terhubung */}
      <FadeInUp delay={0.15}>
      <section className="mx-5 mb-6 lg:mx-0">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Sistem Terhubung
        </h3>
        <div className="space-y-2.5 lg:grid lg:grid-cols-3 lg:gap-3 lg:space-y-0">
          {sistemTerhubungData.map((sys) => (
            <a
              key={sys.nama}
              href={sys.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-colors hover:bg-accent/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  <ExternalLink size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{sys.nama}</h4>
                  <p className="text-[10px] text-muted-foreground">{sys.deskripsi}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-200 bg-green-50 text-[8px] font-bold text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                <Check size={10} className="mr-0.5" />
                {sys.status}
              </Badge>
            </a>
          ))}
        </div>
      </section>
      </FadeInUp>

      {/* Tombol logout */}
      <FadeInUp delay={0.2}>
      <section className="mx-5 lg:mx-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-bold text-destructive transition-all hover:bg-destructive/10 active:scale-[0.98]"
        >
          <LogOut size={18} />
          Keluar dari Akun
        </button>
        <p className="mt-4 text-center text-[9px] font-semibold uppercase tracking-[3px] text-muted-foreground/40">
          MY UPN v4.0 — Built with ❤️
        </p>
      </section>
      </FadeInUp>

      </div>{/* end lg:px-10 wrapper */}
    </div>
    </PageTransition>
  )
}
