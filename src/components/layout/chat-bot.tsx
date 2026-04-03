// === Floating FAQ Chat Bot ===
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
  time: string
}

// FAQ Database
const faqResponses: Record<string, string> = {
  "ukt": "💰 Pembayaran UKT dilakukan melalui bank yang ditunjuk (BNI/Mandiri). Cek nomor Virtual Account di SIAMIK.",
  "krs": "📋 Pengisian KRS dilakukan melalui SIAMIK pada periode yang ditentukan. Pastikan tidak melebihi batas SKS.",
  "jadwal": "📅 Jadwal kuliah bisa dilihat di menu Layanan > Jadwal Kelas atau di Dashboard (Jadwal Hari Ini).",
  "nilai": "📊 Nilai bisa dilihat di halaman Akademik. Klik mata kuliah untuk detail komponen nilai.",
  "kehadiran": "✅ Kehadiran bisa dilihat di halaman Layanan > Kehadiran. Minimum kehadiran 75%.",
  "wisuda": "🎓 Pendaftaran wisuda melalui SIAMIK. Pastikan semua persyaratan (SKS, ujian, dll) terpenuhi.",
  "cuti": "📝 Pengajuan cuti akademik melalui SIAMIK minimal 2 minggu sebelum semester dimulai.",
  "siamik": "🌐 SIAMIK bisa diakses di https://siamik.upnjatim.ac.id. Gunakan NPM dan password Anda.",
  "ipk": "📈 IPK dihitung dari akumulasi seluruh nilai. IPK kamu saat ini: 3.72 (Cum Laude!).",
  "sks": "📚 Batas SKS per semester ditentukan berdasarkan IPS: IPS ≥ 3.0 = 24 SKS, IPS ≥ 2.5 = 21 SKS.",
  "lp3m": "📝 Kuisioner LP3M wajib diisi sebelum bisa melihat KHS. Akses di lp3m.upnjatim.ac.id.",
  "ilmu": "📖 E-Learning ILMU2 di https://ilmu.upnjatim.ac.id untuk tugas dan materi kuliah online.",
}

function findAnswer(query: string): string {
  const q = query.toLowerCase()
  for (const [key, val] of Object.entries(faqResponses)) {
    if (q.includes(key)) return val
  }
  // Default
  return "🤔 Maaf, saya belum bisa menjawab pertanyaan itu. Coba tanyakan tentang: UKT, KRS, jadwal, nilai, kehadiran, wisuda, cuti, SIAMIK, IPK, SKS, LP3M, atau ILMU2."
}

const quickQuestions = ["UKT", "KRS", "Jadwal", "Nilai", "Kehadiran", "SIAMIK"]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Halo! 👋 Saya asisten MY UPN. Kamu bisa tanya tentang UKT, KRS, jadwal, nilai, dan lainnya.",
      sender: "bot",
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll ke bawah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })

    // User message
    const userMsg: Message = { id: `u-${Date.now()}`, text, sender: "user", time: now }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Bot response (delay 500ms)
    setTimeout(() => {
      const answer = findAnswer(text)
      const botMsg: Message = { id: `b-${Date.now()}`, text: answer, sender: "bot", time: now }
      setMessages((prev) => [...prev, botMsg])
    }, 500)
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-xl shadow-green-500/30 hover:shadow-2xl transition-shadow"
            aria-label="Buka chat bantuan"
          >
            <MessageCircle size={24} />
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-destructive border-2 border-background text-[8px] font-bold text-white flex items-center justify-center">
              ?
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-20 right-3 z-[61] w-[calc(100%-1.5rem)] max-w-[360px] overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Asisten MY UPN</h3>
                    <p className="text-[9px] text-white/70">Online · FAQ Bot</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="max-h-[45vh] overflow-y-auto p-3 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.sender === "bot"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {msg.sender === "bot" ? <Bot size={13} /> : <User size={13} />}
                    </div>
                    <div className={`max-w-[75%] rounded-xl px-3 py-2 ${
                      msg.sender === "bot"
                        ? "bg-muted/50 text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}>
                      <p className="text-[11px] leading-relaxed">{msg.text}</p>
                      <p className={`mt-0.5 text-[8px] ${
                        msg.sender === "bot" ? "text-muted-foreground/60" : "text-primary-foreground/60"
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick questions */}
              <div className="flex gap-1.5 overflow-x-auto px-3 py-2 border-t border-border/30">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="shrink-0 rounded-full bg-muted/50 px-2.5 py-1 text-[9px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 border-t border-border/50 p-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ketik pertanyaan..."
                  className="flex-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
