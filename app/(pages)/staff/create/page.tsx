"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  UserPlus, 
  ArrowLeft, 
  User, 
  Phone, 
  ShieldCheck, 
  Lock, 
  Send, 
  Building2 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CreateStaffPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    // Перетворюємо числові поля
    const formattedPayload = {
      ...payload,
      telegram_id: Number(payload.telegram_id) || 0,
      company_id: Number(payload.company_id) || 0,
    }

    try {
      const res = await fetch("/api/v1/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPayload),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.error || "Помилка при створенні")

      // Якщо успішно — редірект до списку (або куди тобі потрібно)
      router.push("/managers") 
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Додати співробітника</h1>
          <p className="text-muted-foreground">Заповніть дані для створення нового аккаунту менеджера або адміна.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Основні дані */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" /> Повне ім'я
            </label>
            <Input name="name" placeholder="Іван Іванов" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" /> Username (Логін)
            </label>
            <Input name="username" placeholder="ivan_manager" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" /> Телефон
            </label>
            <Input name="phone" placeholder="+380..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" /> Роль
            </label>
            <select 
              name="role" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="manager">Менеджер</option>
              <option value="admin">Адміністратор</option>
              <option value="senior">Старший менеджер</option>
            </select>
          </div>

          {/* Телеграм дані */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Send className="h-4 w-4 text-muted-foreground" /> Telegram Username
            </label>
            <Input name="telegram_username" placeholder="@username" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Send className="h-4 w-4 text-muted-foreground" /> Telegram ID
            </label>
            <Input name="telegram_id" type="number" placeholder="12345678" />
          </div>

          {/* Компанія та доступи */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" /> ID Компанії
            </label>
            <Input name="company_id" type="number" placeholder="1" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" /> Пароль
            </label>
            <Input name="password" type="password" placeholder="••••••••" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Права доступу (Permissions)</label>
          <Input name="permissions" placeholder="Наприклад: all, read_only..." />
        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            type="submit" 
            className="flex-1 md:flex-none md:w-[200px]" 
            disabled={loading}
          >
            {loading ? "Створення..." : "Створити співробітника"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
          >
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  )
}