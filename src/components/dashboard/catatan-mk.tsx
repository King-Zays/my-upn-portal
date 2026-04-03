// === Catatan per Mata Kuliah — simpan di localStorage ===
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StickyNote, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Catatan {
  id: string
  text: string
  createdAt: string
}

const STORAGE_KEY = "myupn-catatan"

function getCatatan(kode: string): Catatan[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(`${STORAGE_KEY}-${kode}`)
  return data ? JSON.parse(data) : []
}

function saveCatatan(kode: string, items: Catatan[]) {
  localStorage.setItem(`${STORAGE_KEY}-${kode}`, JSON.stringify(items))
}

export function CatatanMK({ kode, namaMK }: { kode: string; namaMK: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<Catatan[]>([])
  const [newText, setNewText] = useState("")

  // Load dari localStorage
  useEffect(() => {
    setItems(getCatatan(kode))
  }, [kode])

  const handleAdd = () => {
    if (!newText.trim()) return
    const newItem: Catatan = {
      id: Date.now().toString(),
      text: newText.trim(),
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
    const updated = [newItem, ...items]
    setItems(updated)
    saveCatatan(kode, updated)
    setNewText("")
    toast.success("Catatan ditambahkan!")
  }

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    saveCatatan(kode, updated)
    toast.info("Catatan dihapus")
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-3 py-2 text-[10px] font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <StickyNote size={14} />
        Catatan {items.length > 0 && `(${items.length})`}
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
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-x-4 bottom-4 top-auto z-[71] max-h-[70vh] max-w-[398px] mx-auto overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Catatan</h3>
                  <p className="text-[10px] text-muted-foreground">{namaMK}</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Input */}
              <div className="flex gap-2 border-b border-border/50 p-3">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Tulis catatan baru..."
                  className="flex-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                />
                <Button size="sm" onClick={handleAdd} className="h-9 w-9 p-0">
                  <Plus size={16} />
                </Button>
              </div>

              {/* List */}
              <div className="max-h-[40vh] overflow-y-auto p-3 space-y-2">
                {items.length === 0 && (
                  <div className="py-6 text-center">
                    <StickyNote size={28} className="mx-auto text-muted-foreground/20" />
                    <p className="mt-2 text-xs text-muted-foreground">Belum ada catatan</p>
                  </div>
                )}
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group flex items-start gap-2 rounded-lg border border-border/30 bg-background p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">{item.text}</p>
                      <p className="mt-1 text-[9px] text-muted-foreground/60">{item.createdAt}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
