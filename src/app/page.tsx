// === Splash Screen MY UPN — animasi logo lalu redirect ke login ===
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap } from "lucide-react"

export default function SplashPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "done">("loading")

  useEffect(() => {
    // Progress bar 0→100% dalam 1.5 detik
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 4
      })
    }, 50)

    // Setelah 1.8 detik, tandai selesai lalu redirect
    const timer = setTimeout(() => {
      setPhase("done")
      setTimeout(() => router.push("/login"), 400)
    }, 1800)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-green-500 to-emerald-700">
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-5"
          >
            {/* Logo icon */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl shadow-black/10"
            >
              <GraduationCap className="h-10 w-10 text-white" />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center"
            >
              <h1 className="font-heading text-3xl font-bold text-white tracking-tight">
                MY UPN
              </h1>
              <p className="mt-1 text-xs font-medium text-white/70">
                Portal Mahasiswa · UPN Veteran Jawa Timur
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "160px" }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="h-1 overflow-hidden rounded-full bg-white/20"
            >
              <motion.div
                className="h-full rounded-full bg-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </motion.div>

            {/* Version */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-[9px] font-bold uppercase tracking-[4px] text-white/40"
            >
              v4.0
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
