// === ⌘K Command Palette — navigasi cepat ke semua hal ===
"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  X,
  Home,
  LayoutGrid,
  BookOpen,
  Calendar,
  User,
  Bell,
  Clock,
  Moon,
  Sun,
  Globe,
  FileText,
  MessageCircle,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { useTheme } from "next-themes"
import { mataKuliahData, layananData, jadwalMingguanData } from "@/lib/mock-data"
import { useI18n } from "@/lib/i18n"

// === Types ===
type ResultGroup = "recent" | "pages" | "courses" | "services" | "actions"

interface PaletteItem {
  id: string
  title: string
  subtitle: string
  group: ResultGroup
  icon: React.ReactNode
  href?: string
  action?: () => void
  keywords?: string
}

// === Konstanta halaman navigasi ===
const STORAGE_KEY = "myupn-cmd-recent"
const MAX_RECENT = 5

// === Custom event untuk trigger dari luar ===
export const openCommandPalette = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-command-palette"))
  }
}

export function CommandPalette() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { t, locale, setLocale } = useI18n()

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentIds, setRecentIds] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // === Load recent dari localStorage ===
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setRecentIds(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const saveRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECENT)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  // === Global keyboard shortcut Ctrl+K / ⌘K ===
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // === Listener custom event trigger dari komponen lain ===
  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener("open-command-palette", handler)
    return () => window.removeEventListener("open-command-palette", handler)
  }, [])

  // === Auto-focus input saat terbuka ===
  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // === Build seluruh item palette ===
  const allItems = useMemo<PaletteItem[]>(() => {
    const items: PaletteItem[] = []

    // -- Halaman navigasi --
    const pages = [
      { id: "page-dashboard", title: t("nav.beranda"), icon: <Home size={16} />, href: "/dashboard", keywords: "beranda home dashboard" },
      { id: "page-layanan", title: t("nav.layanan"), icon: <LayoutGrid size={16} />, href: "/layanan", keywords: "layanan services" },
      { id: "page-akademik", title: t("nav.akademik"), icon: <BookOpen size={16} />, href: "/akademik", keywords: "akademik academic nilai" },
      { id: "page-kalender", title: t("kal.title"), icon: <Calendar size={16} />, href: "/kalender", keywords: "kalender calendar jadwal" },
      { id: "page-notifikasi", title: t("prof.notifikasi"), icon: <Bell size={16} />, href: "/notifikasi", keywords: "notifikasi notification" },
      { id: "page-profil", title: t("nav.profil"), icon: <User size={16} />, href: "/profil", keywords: "profil profile akun" },
    ]
    pages.forEach((p) =>
      items.push({ ...p, subtitle: p.href, group: "pages" })
    )

    // -- Mata kuliah --
    mataKuliahData.forEach((mk) => {
      items.push({
        id: `mk-${mk.kode}`,
        title: mk.nama,
        subtitle: `${mk.kode} · ${mk.sks} SKS · ${mk.dosen}`,
        group: "courses",
        icon: <BookOpen size={16} />,
        href: `/akademik/${mk.kode}`,
        keywords: `${mk.nama} ${mk.kode} ${mk.dosen}`.toLowerCase(),
      })
    })

    // -- Layanan --
    layananData.forEach((l) => {
      items.push({
        id: `layanan-${l.id}`,
        title: l.label,
        subtitle: t("cmd.services"),
        group: "services",
        icon: <LayoutGrid size={16} />,
        href: l.href,
        keywords: l.label.toLowerCase(),
      })
    })

    // -- Aksi cepat --
    items.push({
      id: "action-dark",
      title: t("cmd.toggleDark"),
      subtitle: theme === "dark" ? "→ Light Mode" : "→ Dark Mode",
      group: "actions",
      icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      keywords: "dark mode gelap terang light theme",
    })

    items.push({
      id: "action-lang",
      title: t("cmd.toggleLang"),
      subtitle: locale === "id" ? "→ English" : "→ Bahasa Indonesia",
      group: "actions",
      icon: <Globe size={16} />,
      action: () => setLocale(locale === "id" ? "en" : "id"),
      keywords: "bahasa language english indonesia",
    })

    items.push({
      id: "action-export",
      title: t("cmd.exportKHS"),
      subtitle: "PDF",
      group: "actions",
      icon: <FileText size={16} />,
      href: "/akademik",
      keywords: "export khs pdf transkrip transcript",
    })

    items.push({
      id: "action-chat",
      title: t("cmd.openChat"),
      subtitle: "MY UPN Assistant",
      group: "actions",
      icon: <MessageCircle size={16} />,
      action: () => {
        // Trigger chatbot terbuka — gunakan custom event
        window.dispatchEvent(new CustomEvent("open-chatbot"))
      },
      keywords: "chat bot asisten assistant bantuan help",
    })

    return items
  }, [t, theme, locale, setTheme, setLocale])

  // === Filter results berdasarkan query ===
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      // Tampilkan recent + semua group (limited)
      const recent = recentIds
        .map((id) => allItems.find((item) => item.id === id))
        .filter(Boolean) as PaletteItem[]

      // Ambil max 4 pages, 3 courses, 3 services, semua actions
      const pages = allItems.filter((i) => i.group === "pages").slice(0, 4)
      const actions = allItems.filter((i) => i.group === "actions")

      if (recent.length > 0) {
        return [
          ...recent.map((r) => ({ ...r, group: "recent" as ResultGroup })),
          ...pages,
          ...actions,
        ]
      }
      return [...pages, ...actions]
    }

    const q = query.toLowerCase()
    return allItems
      .filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.includes(q))
      )
      .slice(0, 12)
  }, [query, allItems, recentIds])

  // === Group results untuk rendering ===
  const groupedResults = useMemo(() => {
    const groups: { key: ResultGroup; label: string; items: PaletteItem[] }[] = []
    const groupOrder: ResultGroup[] = ["recent", "pages", "courses", "services", "actions"]
    const groupLabels: Record<ResultGroup, string> = {
      recent: t("cmd.recent"),
      pages: t("cmd.pages"),
      courses: t("cmd.courses"),
      services: t("cmd.services"),
      actions: t("cmd.actions"),
    }

    for (const gKey of groupOrder) {
      const gItems = filteredItems.filter((i) => i.group === gKey)
      if (gItems.length > 0) {
        groups.push({ key: gKey, label: groupLabels[gKey], items: gItems })
      }
    }
    return groups
  }, [filteredItems, t])

  // === Flat list untuk keyboard nav ===
  const flatItems = useMemo(
    () => groupedResults.flatMap((g) => g.items),
    [groupedResults]
  )

  // === Handle selection ===
  const handleSelect = useCallback((item: PaletteItem) => {
    saveRecent(item.id)
    setIsOpen(false)
    if (item.action) {
      item.action()
    } else if (item.href) {
      router.push(item.href)
    }
  }, [router, saveRecent])

  // === Keyboard navigation ===
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % flatItems.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (flatItems[activeIndex]) {
        handleSelect(flatItems[activeIndex])
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setIsOpen(false)
    }
  }, [flatItems, activeIndex, handleSelect])

  // === Reset active index saat filter berubah ===
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // === Scroll active item into view ===
  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" })
    }
  }, [activeIndex])

  // === Group color config ===
  const groupColors: Record<ResultGroup, string> = {
    recent: "text-amber-600 dark:text-amber-400",
    pages: "text-green-600 dark:text-green-400",
    courses: "text-blue-600 dark:text-blue-400",
    services: "text-purple-600 dark:text-purple-400",
    actions: "text-orange-600 dark:text-orange-400",
  }

  // Hitung flat index global
  let globalIndex = 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* === Backdrop === */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* === Palette Panel === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="fixed left-1/2 top-[min(20vh,6rem)] z-[81] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2"
            onKeyDown={handleKeyDown}
          >
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20 dark:shadow-black/50">
              {/* === Search Input === */}
              <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5">
                <Search size={18} className="shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("cmd.placeholder")}
                  className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query ? (
                  <button
                    onClick={() => setQuery("")}
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <kbd className="hidden rounded-md border border-border/60 bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground sm:inline-block">
                    ESC
                  </kbd>
                )}
              </div>

              {/* === Results === */}
              <div ref={listRef} className="max-h-[min(60vh,400px)] overflow-y-auto overscroll-contain p-1.5">
                {groupedResults.length > 0 ? (
                  groupedResults.map((group) => (
                    <div key={group.key} className="mb-1">
                      {/* Group header */}
                      <div className="flex items-center gap-2 px-3 pb-1 pt-2.5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${groupColors[group.key]}`}>
                          {group.label}
                        </span>
                        <div className="h-px flex-1 bg-border/40" />
                      </div>

                      {/* Group items */}
                      {group.items.map((item) => {
                        const idx = globalIndex++
                        const isActive = idx === activeIndex

                        return (
                          <button
                            key={item.id}
                            data-index={idx}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-100 ${
                              isActive
                                ? "bg-accent/60 dark:bg-accent/40"
                                : "hover:bg-accent/30"
                            }`}
                          >
                            {/* Active indicator */}
                            {isActive && (
                              <motion.span
                                layoutId="cmd-active"
                                className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              />
                            )}

                            {/* Icon */}
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              isActive ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
                            } transition-colors`}>
                              {item.icon}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                                {item.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {item.subtitle}
                              </p>
                            </div>

                            {/* Enter hint on active */}
                            {isActive && (
                              <kbd className="hidden shrink-0 rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground sm:inline-block">
                                ↵
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))
                ) : (
                  /* Empty state */
                  <div className="px-4 py-10 text-center">
                    <Search size={32} className="mx-auto text-muted-foreground/20" />
                    <p className="mt-2.5 text-sm font-semibold text-muted-foreground">
                      {t("cmd.noResults")}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                      {t("cmd.tryOther")}
                    </p>
                  </div>
                )}
              </div>

              {/* === Footer keyboard hints === */}
              <div className="flex items-center gap-4 border-t border-border/50 bg-muted/30 px-4 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <kbd className="inline-flex h-4 w-4 items-center justify-center rounded border border-border/60 bg-muted/60 font-mono text-[8px]">
                      <ArrowUp size={8} />
                    </kbd>
                    <kbd className="inline-flex h-4 w-4 items-center justify-center rounded border border-border/60 bg-muted/60 font-mono text-[8px]">
                      <ArrowDown size={8} />
                    </kbd>
                  </span>
                  <span className="font-medium">{t("cmd.navigate")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <kbd className="inline-flex h-4 items-center justify-center rounded border border-border/60 bg-muted/60 px-1 font-mono text-[8px]">
                    <CornerDownLeft size={8} />
                  </kbd>
                  <span className="font-medium">{t("cmd.select")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <kbd className="inline-flex h-4 items-center justify-center rounded border border-border/60 bg-muted/60 px-1 font-mono text-[8px]">
                    ESC
                  </kbd>
                  <span className="font-medium">{t("cmd.close")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
