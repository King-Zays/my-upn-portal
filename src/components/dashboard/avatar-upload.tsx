// === Avatar Upload — crop & simpan di localStorage ===
"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, X, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const AVATAR_KEY = "myupn-avatar"

export function useAvatar() {
  const getAvatar = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(AVATAR_KEY)
  }
  const setAvatar = (data: string | null) => {
    if (data) localStorage.setItem(AVATAR_KEY, data)
    else localStorage.removeItem(AVATAR_KEY)
  }
  return { getAvatar, setAvatar }
}

export function AvatarUpload({
  initials,
  onUpdate,
}: {
  initials: string
  onUpdate?: (url: string | null) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [current, setCurrent] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(AVATAR_KEY)
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      // Resize to 200x200 canvas
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 200
        canvas.height = 200
        const ctx = canvas.getContext("2d")!
        const size = Math.min(img.width, img.height)
        const sx = (img.width - size) / 2
        const sy = (img.height - size) / 2
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200)
        setPreview(canvas.toDataURL("image/jpeg", 0.8))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (preview) {
      localStorage.setItem(AVATAR_KEY, preview)
      setCurrent(preview)
      onUpdate?.(preview)
      toast.success("Foto profil berhasil diubah!")
    }
    setPreview(null)
    setIsOpen(false)
  }

  const handleRemove = () => {
    localStorage.removeItem(AVATAR_KEY)
    setCurrent(null)
    setPreview(null)
    onUpdate?.(null)
    toast.info("Foto profil dihapus")
    setIsOpen(false)
  }

  return (
    <>
      {/* Avatar display — clickable */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative"
        aria-label="Ubah foto profil"
      >
        {current ? (
          <img
            src={current}
            alt="Foto profil"
            className="h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-background"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-3xl font-bold text-white shadow-xl shadow-green-500/20 ring-4 ring-background">
            {initials}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform group-hover:scale-110">
          <Camera size={14} />
        </div>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
              onClick={() => { setIsOpen(false); setPreview(null) }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">Foto Profil</h3>
                <button onClick={() => { setIsOpen(false); setPreview(null) }} className="text-muted-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-4">
                {preview || current ? (
                  <img
                    src={preview || current || ""}
                    alt="Preview"
                    className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-4xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>

              {/* Actions */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
              <div className="space-y-2">
                <Button
                  onClick={() => fileRef.current?.click()}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Camera size={16} />
                  {current ? "Ganti Foto" : "Pilih Foto"}
                </Button>

                {preview && (
                  <Button onClick={handleSave} className="w-full gap-2 bg-primary">
                    <Check size={16} />
                    Simpan
                  </Button>
                )}

                {current && !preview && (
                  <Button
                    onClick={handleRemove}
                    variant="outline"
                    className="w-full gap-2 border-destructive/30 text-destructive"
                  >
                    <Trash2 size={16} />
                    Hapus Foto
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
