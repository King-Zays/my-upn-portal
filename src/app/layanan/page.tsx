// === Halaman Layanan — grid menu layanan kampus ===
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Clock, CheckSquare, BookOpen, FileText, CalendarDays,
  Award, CreditCard, TrendingUp, ClipboardList, ExternalLink
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageTransition, FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/motion"
import { layananData, type LayananItem } from "@/lib/mock-data"

// Mapping string icon ke komponen Lucide
const iconMap: Record<string, React.ReactNode> = {
  Clock: <Clock size={22} />,
  CheckSquare: <CheckSquare size={22} />,
  BookOpen: <BookOpen size={22} />,
  FileText: <FileText size={22} />,
  CalendarDays: <CalendarDays size={22} />,
  Award: <Award size={22} />,
  CreditCard: <CreditCard size={22} />,
  TrendingUp: <TrendingUp size={22} />,
  ClipboardList: <ClipboardList size={22} />,
}

// Pill tabs untuk filter ala Ruangguru
const tabs = ["Semua", "Akademik", "Administrasi", "E-Resource"]

export default function LayananPage() {
  const [activeTab, setActiveTab] = useState("Semua")

  return (
    <PageTransition>
      <div className="pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-5 pb-4 pt-14 backdrop-blur-xl lg:px-10 lg:pt-6">
          <h1 className="font-heading text-xl font-bold text-foreground lg:text-2xl">Layanan</h1>
          <p className="text-xs text-muted-foreground">Akses semua layanan kampus</p>

          {/* Pill tabs — ala Ruangguru */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-sm"
                    : "bg-accent/50 text-muted-foreground hover:bg-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="lg:px-10">
          {/* Grid layanan — responsive: 3col mobile, 4col tablet, 6col desktop */}
          <FadeInUp>
            <section className="px-5 pt-5 lg:px-0">
              <StaggerContainer className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
                {layananData.map((item: LayananItem) => (
                  <StaggerItem key={item.id}>
                    <Link
                      href={item.href}
                      className="relative flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 active:scale-95"
                    >
                      {/* Badge jika ada */}
                      {item.badge && (
                        <Badge
                          variant="destructive"
                          className="absolute -right-1 -top-1 px-1.5 text-[8px] font-bold"
                        >
                          {item.badge}
                        </Badge>
                      )}

                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                        {iconMap[item.icon] || <FileText size={22} />}
                      </div>
                      <span className="text-center text-[10px] font-bold leading-tight text-foreground">
                        {item.label}
                      </span>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </FadeInUp>

          {/* Sistem terkait — responsive: stack mobile, 3-col desktop */}
          <FadeInUp delay={0.15}>
            <section className="mt-6 px-5 lg:px-0">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Sistem Terkait
              </h2>
              <StaggerContainer className="space-y-2.5 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
                {[
                  { name: "SIAMIK", desc: "Sistem Informasi Akademik", url: "https://siamik.upnjatim.ac.id" },
                  { name: "ILMU2", desc: "E-Learning & Tugas", url: "https://ilmu.upnjatim.ac.id" },
                  { name: "LP3M", desc: "Evaluasi Pembelajaran", url: "https://lp3m.upnjatim.ac.id" },
                ].map((sys) => (
                  <StaggerItem key={sys.name}>
                    <a
                      href={sys.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 transition-all hover:bg-accent/30 hover:shadow-sm active:scale-[0.98]"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{sys.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{sys.desc}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="text-[10px] font-bold">Buka</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          </FadeInUp>
        </div>
      </div>
    </PageTransition>
  )
}

