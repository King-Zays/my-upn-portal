// === PWA Install Prompt Banner ===
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Cek apakah sudah pernah di-dismiss
    if (typeof window !== "undefined") {
      const wasDismissed = sessionStorage.getItem("pwa-install-dismissed")
      if (wasDismissed) return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Tampilkan banner setelah 3 detik agar tidak mengganggu
      setTimeout(() => setShowBanner(true), 3000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === "accepted") {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    sessionStorage.setItem("pwa-install-dismissed", "true")
  }

  // Jangan tampilkan jika sudah di-dismiss atau tidak ada prompt
  if (dismissed || !showBanner) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-20 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-2xl backdrop-blur-xl">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-md shadow-green-500/20">
              <Download size={20} className="text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-foreground">Install MY UPN</h4>
              <p className="text-[10px] text-muted-foreground">
                Tambahkan ke Home Screen untuk akses cepat
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 text-[10px] font-bold shadow-sm"
              >
                Install
              </Button>
              <button
                onClick={handleDismiss}
                aria-label="Tutup"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
