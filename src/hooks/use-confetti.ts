// === Confetti celebration untuk pencapaian akademik ===
"use client"

import { useEffect, useCallback } from "react"
import confetti from "canvas-confetti"

export function useConfetti(ipk: number) {
  const fire = useCallback(() => {
    // Hijau & emas confetti — sesuai brand UPN
    const colors = ["#22c55e", "#16a34a", "#facc15", "#f59e0b", "#ffffff"]

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true,
    })

    // Burst kedua setelah 200ms
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        disableForReducedMotion: true,
      })
    }, 200)
  }, [])

  useEffect(() => {
    // Hanya fire jika IPK >= 3.5 (cum laude territory)
    if (ipk >= 3.5) {
      // Delay agar animasi page transition selesai dulu
      const timer = setTimeout(fire, 1200)
      return () => clearTimeout(timer)
    }
  }, [ipk, fire])
}
