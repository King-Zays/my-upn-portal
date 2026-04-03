// === i18n — Sistem Multi-Language ID/EN ===
"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Locale = "id" | "en"

// Kamus terjemahan
const translations: Record<string, Record<Locale, string>> = {
  // === Navigasi ===
  "nav.beranda": { id: "Beranda", en: "Home" },
  "nav.layanan": { id: "Layanan", en: "Services" },
  "nav.akademik": { id: "Akademik", en: "Academic" },
  "nav.profil": { id: "Profil", en: "Profile" },

  // === Dashboard ===
  "dash.greeting.pagi": { id: "Selamat pagi", en: "Good morning" },
  "dash.greeting.siang": { id: "Selamat siang", en: "Good afternoon" },
  "dash.greeting.sore": { id: "Selamat sore", en: "Good evening" },
  "dash.greeting.malam": { id: "Selamat malam", en: "Good night" },
  "dash.semester": { id: "Semester", en: "Semester" },
  "dash.minggu": { id: "Minggu ke-", en: "Week " },
  "dash.dari": { id: "dari", en: "of" },
  "dash.mingguLagi": { id: "minggu lagi", en: "weeks left" },
  "dash.hinggaUAS": { id: "hingga UAS", en: "until Final Exam" },
  "dash.ringkasan": { id: "Ringkasan Akademik", en: "Academic Summary" },
  "dash.sksLulus": { id: "SKS Lulus", en: "Credits Passed" },
  "dash.jadwalHariIni": { id: "Jadwal Hari Ini", en: "Today's Schedule" },
  "dash.kelas": { id: "Kelas", en: "Classes" },
  "dash.aksesCepat": { id: "Akses Cepat", en: "Quick Access" },
  "dash.pengumuman": { id: "Pengumuman", en: "Announcements" },

  // === Akademik ===
  "akd.title": { id: "Akademik", en: "Academic" },
  "akd.perkembangan": { id: "Perkembangan IPS & IPK", en: "GPA Trends" },
  "akd.kehadiran": { id: "Kehadiran", en: "Attendance" },
  "akd.distribusi": { id: "Distribusi Nilai", en: "Grade Distribution" },
  "akd.cariMK": { id: "Cari mata kuliah...", en: "Search courses..." },
  "akd.semua": { id: "Semua", en: "All" },
  "akd.mk": { id: "Mata Kuliah Semester Ini", en: "This Semester's Courses" },
  "akd.export": { id: "Export KHS (PDF)", en: "Export Transcript (PDF)" },
  "akd.pertemuan": { id: "pertemuan", en: "sessions" },
  "akd.komponenNilai": { id: "Komponen Nilai", en: "Grade Components" },
  "akd.ratarata": { id: "Rata-rata", en: "Average" },
  "akd.catatan": { id: "Catatan Pribadi", en: "Personal Notes" },

  // === Kalender ===
  "kal.title": { id: "Kalender Akademik", en: "Academic Calendar" },
  "kal.eventBulan": { id: "Event Bulan Ini", en: "This Month's Events" },
  "kal.ujian": { id: "Ujian", en: "Exam" },
  "kal.deadline": { id: "Deadline", en: "Deadline" },
  "kal.libur": { id: "Libur", en: "Holiday" },
  "kal.tidakAda": { id: "Tidak ada jadwal atau event di hari ini", en: "No schedule or events today" },

  // === Profil ===
  "prof.status": { id: "Aktif", en: "Active" },
  "prof.angkatan": { id: "Angkatan", en: "Class of" },
  "prof.pencapaian": { id: "Pencapaian", en: "Achievements" },
  "prof.unlocked": { id: "Unlocked", en: "Unlocked" },
  "prof.modeGelap": { id: "Mode Gelap", en: "Dark Mode" },
  "prof.akun": { id: "Akun & Pengaturan", en: "Account & Settings" },
  "prof.editProfil": { id: "Edit Profil", en: "Edit Profile" },
  "prof.gantiPassword": { id: "Ganti Password", en: "Change Password" },
  "prof.notifikasi": { id: "Notifikasi", en: "Notifications" },
  "prof.bantuan": { id: "Pusat Bantuan", en: "Help Center" },
  "prof.tentang": { id: "Tentang Aplikasi", en: "About App" },
  "prof.sistemTerhubung": { id: "Sistem Terhubung", en: "Connected Systems" },
  "prof.keluar": { id: "Keluar dari Akun", en: "Sign Out" },
  "prof.fotoUbah": { id: "Ubah foto profil", en: "Change profile photo" },

  // === Layanan ===
  "lay.title": { id: "Layanan", en: "Services" },
  "lay.subtitle": { id: "Semua layanan kampus dalam satu genggaman", en: "All campus services in one place" },

  // === Login ===
  "login.title": { id: "Masuk ke MY UPN", en: "Sign in to MY UPN" },
  "login.email": { id: "Email atau NPM", en: "Email or Student ID" },
  "login.password": { id: "Password", en: "Password" },
  "login.masuk": { id: "Masuk", en: "Sign In" },
  "login.lupa": { id: "Lupa password?", en: "Forgot password?" },
  "login.ingat": { id: "Ingat saya", en: "Remember me" },

  // === Notifikasi ===
  "notif.title": { id: "Notifikasi", en: "Notifications" },
  "notif.tandai": { id: "Tandai semua dibaca", en: "Mark all as read" },

  // === Chat ===
  "chat.title": { id: "Asisten MY UPN", en: "MY UPN Assistant" },
  "chat.placeholder": { id: "Ketik pertanyaan...", en: "Type a question..." },
  "chat.welcome": {
    id: "Halo! 👋 Saya asisten MY UPN. Kamu bisa tanya tentang UKT, KRS, jadwal, nilai, dan lainnya.",
    en: "Hello! 👋 I'm the MY UPN assistant. You can ask about tuition, course registration, schedule, grades, and more.",
  },

  // === Umum ===
  "umum.segera": { id: "⚡ Segera", en: "⚡ Urgent" },
  "umum.mendatang": { id: "Mendatang", en: "Upcoming" },
  "umum.cari": { id: "Cari mata kuliah, dosen, layanan...", en: "Search courses, lecturers, services..." },
  "umum.tidakDitemukan": { id: "Tidak ditemukan", en: "Not found" },
  "umum.cobaLain": { id: "Coba kata kunci lain", en: "Try other keywords" },
  "umum.bahasa": { id: "Bahasa", en: "Language" },

  // === Command Palette ===
  "cmd.placeholder": { id: "Cari halaman, MK, layanan...", en: "Search pages, courses, services..." },
  "cmd.pages": { id: "Halaman", en: "Pages" },
  "cmd.courses": { id: "Mata Kuliah", en: "Courses" },
  "cmd.services": { id: "Layanan Kampus", en: "Campus Services" },
  "cmd.actions": { id: "Aksi Cepat", en: "Quick Actions" },
  "cmd.recent": { id: "Terakhir Dicari", en: "Recent" },
  "cmd.noResults": { id: "Tidak ditemukan", en: "No results" },
  "cmd.tryOther": { id: "Coba kata kunci lain", en: "Try other keywords" },
  "cmd.toggleDark": { id: "Toggle Mode Gelap", en: "Toggle Dark Mode" },
  "cmd.toggleLang": { id: "Ganti Bahasa", en: "Switch Language" },
  "cmd.exportKHS": { id: "Export KHS (PDF)", en: "Export Transcript (PDF)" },
  "cmd.openChat": { id: "Buka Asisten", en: "Open Assistant" },
  "cmd.navigate": { id: "Navigasi", en: "Navigate" },
  "cmd.select": { id: "Pilih", en: "Select" },
  "cmd.close": { id: "Tutup", en: "Close" },
}

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: "id",
  setLocale: () => {},
  t: (key) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("myupn-lang") as Locale) || "id"
    }
    return "id"
  })

  const changeLocale = useCallback((l: Locale) => {
    setLocale(l)
    if (typeof window !== "undefined") {
      localStorage.setItem("myupn-lang", l)
    }
  }, [])

  const t = useCallback(
    (key: string) => {
      return translations[key]?.[locale] || key
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

// Toggle component
export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === "id" ? "en" : "id")}
      className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-3 py-1.5 text-xs font-bold transition-colors hover:bg-accent/30"
    >
      <span className="text-sm">{locale === "id" ? "🇮🇩" : "🇬🇧"}</span>
      <span className="text-muted-foreground">{locale === "id" ? "ID" : "EN"}</span>
    </button>
  )
}
