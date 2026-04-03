// === Achievement Badges — Gamification untuk mahasiswa ===
"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion"
import { Award, Target, Flame, BookCheck, Star, Trophy } from "lucide-react"
import { mahasiswaData, kehadiranData } from "@/lib/mock-data"

interface Achievement {
  id: string
  title: string
  description: string
  icon: typeof Award
  unlocked: boolean
  color: string
  bg: string
}

function getAchievements(): Achievement[] {
  const mhs = mahasiswaData
  const avgKehadiran = kehadiranData.reduce((sum, k) => sum + k.persentase, 0) / kehadiranData.length

  return [
    {
      id: "cumlaude",
      title: "Cum Laude",
      description: "IPK ≥ 3.50",
      icon: Trophy,
      unlocked: mhs.ipk >= 3.5,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      id: "ipstinggi",
      title: "Semester Emas",
      description: "IPS ≥ 3.80",
      icon: Star,
      unlocked: mhs.ips >= 3.8,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      id: "rajin",
      title: "Rajin Hadir",
      description: "Kehadiran rata-rata ≥ 90%",
      icon: Target,
      unlocked: avgKehadiran >= 90,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "sksmaster",
      title: "SKS Master",
      description: "≥ 80 SKS lulus",
      icon: BookCheck,
      unlocked: mhs.sksLulus >= 80,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "streak",
      title: "Login Streak",
      description: "Login 7 hari berturut-turut",
      icon: Flame,
      unlocked: true, // mock: always true
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      id: "explorer",
      title: "Explorer",
      description: "Buka semua halaman portal",
      icon: Award,
      unlocked: true, // mock
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]
}

export function AchievementSection() {
  const achievements = getAchievements()
  const unlocked = achievements.filter((a) => a.unlocked).length

  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Pencapaian
        </h2>
        <span className="text-[10px] font-bold text-primary">
          {unlocked}/{achievements.length} Unlocked
        </span>
      </div>

      <StaggerContainer className="grid grid-cols-3 gap-2">
        {achievements.map((a) => {
          const Icon = a.icon
          return (
            <StaggerItem key={a.id}>
              <div
                className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                  a.unlocked
                    ? "border-border/50 bg-card shadow-sm"
                    : "border-border/20 bg-muted/30 opacity-40 grayscale"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.bg} ${a.color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-[9px] font-bold text-foreground leading-tight">{a.title}</p>
                <p className="text-[7px] text-muted-foreground">{a.description}</p>
                {a.unlocked && (
                  <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                )}
              </div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
    </section>
  )
}
