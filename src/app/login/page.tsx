// === Halaman Login MY UPN ===
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff, AlertCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Handler login — tidak ada validasi backend, langsung redirect
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("NPM/Email dan password wajib diisi.")
      return
    }

    setIsLoading(true)
    // Simulasi loading 800ms agar terasa realistis
    await new Promise((r) => setTimeout(r, 800))
    toast.success("Login berhasil!", {
      description: "Selamat datang di MY UPN",
    })
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      {/* Dekorasi background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo & Branding */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-500/25">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              MY UPN
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Portal Mahasiswa · UPN Veteran Jawa Timur
            </p>
          </div>
        </div>

        {/* Form Login */}
        <Card className="border-border/50 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Input NPM/Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-semibold text-foreground">
                  NPM / Email
                </label>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="22083010001@student.upnjatim.ac.id"
                  autoComplete="username"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me + Lupa Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  Ingat saya
                </label>
                <button type="button" className="font-semibold text-primary hover:underline">
                  Lupa password?
                </button>
              </div>

              {/* Pesan error */}
              {error && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                  <AlertCircle size={14} />
                  {error}
                </p>
              )}

              {/* Tombol login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-6 text-base font-bold shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/30 active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </span>
                ) : (
                  "MASUK"
                )}
              </Button>
            </form>

            {/* Link bantuan */}
            <div className="mt-5 text-center">
              <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                <HelpCircle size={14} />
                Butuh bantuan login?
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-[10px] leading-relaxed text-muted-foreground">
          Dengan masuk, kamu menyetujui <strong>Kebijakan Privasi</strong> &{" "}
          <strong>Ketentuan Layanan</strong> UPN Veteran Jawa Timur
        </p>
      </div>
    </div>
  )
}
