// === Pull-to-Refresh hook — gesture tarik ke bawah untuk refresh ===
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"

export function usePullToRefresh(onRefresh?: () => void) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startYRef = useRef(0)
  const isPullingRef = useRef(false)
  const threshold = 80

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY
      isPullingRef.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPullingRef.current) return
    const diff = e.touches[0].clientY - startYRef.current
    if (diff > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(diff * 0.4, 120))
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      toast.info("Memperbarui data...")

      // Simulasi refresh 1 detik
      setTimeout(() => {
        onRefresh?.()
        setIsRefreshing(false)
        setPullDistance(0)
        toast.success("Data diperbarui!")
      }, 1000)
    } else {
      setPullDistance(0)
    }
    isPullingRef.current = false
  }, [pullDistance, onRefresh])

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return { isRefreshing, pullDistance, threshold }
}

// === Komponen visual indikator ===
export function PullIndicator({
  pullDistance,
  isRefreshing,
  threshold,
}: {
  pullDistance: number
  isRefreshing: boolean
  threshold: number
}) {
  if (pullDistance === 0 && !isRefreshing) return null

  const progress = Math.min(pullDistance / threshold, 1)
  const rotation = progress * 360

  return (
    <div
      className="flex justify-center overflow-hidden transition-all duration-150"
      style={{ height: isRefreshing ? 48 : pullDistance > 0 ? pullDistance * 0.5 : 0 }}
    >
      <div className="flex items-center justify-center">
        <svg
          className={`h-6 w-6 text-primary ${isRefreshing ? "animate-spin" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          style={{ transform: isRefreshing ? undefined : `rotate(${rotation}deg)` }}
        >
          <path
            d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={isRefreshing ? 1 : progress}
          />
        </svg>
      </div>
    </div>
  )
}
