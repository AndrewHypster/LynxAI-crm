"use client"

import * as React from "react"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "./ui/sonner"

interface AllProvidersProps {
  children: React.ReactNode
}

/**
 * Головний обгортковий компонент для всіх контекст-провайдерів.
 * Використовується в кореневому layout.tsx.
 */
export function AllProviders({ children }: AllProvidersProps) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </SidebarProvider>
      </TooltipProvider>
    </SessionProvider>
  )
}
