// === Layout utama MY UPN ===
import type { Metadata, Viewport } from "next"
import { DM_Sans, Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ErrorBoundary } from "@/components/providers/error-boundary"
import { BottomNav } from "@/components/layout/bottom-nav"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { InstallPrompt } from "@/components/layout/install-prompt"
import { ChatBot } from "@/components/layout/chat-bot"
import { CommandPalette } from "@/components/layout/command-palette"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { I18nProvider } from "@/lib/i18n"
import { Toaster } from "@/components/ui/sonner"

// Font DM Sans untuk body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

// Font Sora untuk heading dan branding
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: "MY UPN — Portal Mahasiswa",
  description: "Portal Mahasiswa UPN Veteran Jawa Timur. Akses SIAMIK, ILMU2, LP3M dalam satu aplikasi modern.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MY UPN",
  },
}

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${sora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
          {/* Sidebar — hanya muncul di lg+ */}
          <SidebarNav />

          {/* Container responsive: mobile=centered 430px, desktop=fill after sidebar */}
          <div className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-x-hidden bg-background shadow-2xl shadow-black/5 dark:shadow-black/30 lg:mx-0 lg:ml-[240px] lg:max-w-none lg:w-auto lg:shadow-none">
            <ErrorBoundary>
              <Breadcrumbs />
              {children}
            </ErrorBoundary>
          </div>

          {/* Bottom nav — hanya muncul di mobile (hidden lg+) */}
          <BottomNav />

          {/* Toast global */}
          <Toaster position="top-center" richColors closeButton />

          {/* PWA Install Prompt */}
          <InstallPrompt />

          {/* Chat FAQ Bot */}
          <ChatBot />

          {/* ⌘K Command Palette */}
          <CommandPalette />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
