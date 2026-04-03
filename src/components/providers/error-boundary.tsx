// === Error Boundary — menangkap crash React dan tampilkan fallback ===
"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallbackTitle?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60dvh] flex-col items-center justify-center px-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle size={32} className="text-destructive" />
          </div>
          <h2 className="mt-4 font-heading text-lg font-bold text-foreground">
            {this.props.fallbackTitle || "Terjadi Kesalahan"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Halaman ini mengalami error. Coba muat ulang atau kembali ke beranda.
          </p>
          {this.state.error && (
            <p className="mt-2 rounded-lg bg-destructive/5 px-3 py-2 text-[10px] font-mono text-destructive/80 max-w-xs break-all">
              {this.state.error.message}
            </p>
          )}
          <div className="mt-5 flex gap-3">
            <Button
              onClick={this.handleReset}
              variant="outline"
              className="gap-2 rounded-xl"
            >
              <RefreshCw size={14} />
              Coba Lagi
            </Button>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              className="gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600"
            >
              Beranda
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
