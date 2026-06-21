import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { AllProviders } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <AllProviders>
          <AppSidebar />
          <main className="flex h-screen w-full flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">LynxAI CRM</h1>
              </div>
              <ThemeToggle />
            </header>
            <div className="flex-1 overflow-auto p-6">{children}</div>
          </main>
        </AllProviders>
      </body>
    </html>
  )
}
