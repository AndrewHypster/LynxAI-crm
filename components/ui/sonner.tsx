"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // ... твої іконки залишаються тут ...
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          
          // Додаємо ці рядки для автоматичного фарбування:
          "--success-bg": "#ecfdf5", // світло-зелений
          "--success-text": "#065f46", // темно-зелений
          "--success-border": "#34d399",
          
          "--error-bg": "#fef2f2",    // світло-червоний
          "--error-text": "#991b1b",   // темно-червоний
          "--error-border": "#f87171",
          
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[var(--normal-bg)] group-[.toaster]:text-[var(--normal-text)] group-[.toaster]:border-[var(--normal-border)]",
          // Додаємо стилі для семантичних типів:
          success: "group-[.toaster]:!bg-[var(--success-bg)] group-[.toaster]:!text-[var(--success-text)] group-[.toaster]:!border-[var(--success-border)]",
          error: "group-[.toaster]:!bg-[var(--error-bg)] group-[.toaster]:!text-[var(--error-text)] group-[.toaster]:!border-[var(--error-border)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
