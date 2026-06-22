"use client"

import React from "react"
import { Shield, Send, Clock, Calendar, User, Activity, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Manager {
  id: number
  telegram_id: number
  username: string | null
  first_name: string | null
  full_name: string | null
  role: string
  role_label: string
  created_at: string
  last_active: string | null
  current_stage: string | null
}

const manager= {
    id: 12,
  telegram_id: 482910482,
  username: "bohdan_crm_pro",
  first_name: "Богдан",
  full_name: "Богдан Ковальчук",
  role: "sales_manager",
  role_label: "Старший менеджер",
  created_at: "2025-11-15T08:30:00.000Z",
  last_active: "2026-06-22T12:15:00.000Z",
  current_stage: "Опрацювання гарячих лідів"
}

export default function ManagerProfileView() {
  // Ініціали для аватарки (якщо немає full_name — беремо першу літеру чи за замовчуванням 'М')
  const initials = manager.full_name
    ? manager.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : manager.first_name?.[0]?.toUpperCase() || "M"

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Хедер профілю */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight">
                {manager.full_name || manager.first_name || "Користувач без імені"}
              </h1>
              <Badge variant="secondary" className="font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400">
                <Shield className="mr-1 h-3 w-3" />
                {manager.role_label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" /> ID: {manager.id}
            </p>
          </div>
        </div>

        {/* Швидка дія (написати в ТГ) */}
        {manager.username && (
          <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
            <a href={`https://t.me/${manager.username}`} target="_blank" rel="noopener noreferrer">
              <Send className="mr-2 h-4 w-4 text-sky-500" />
              Написати в Telegram
            </a>
          </Button>
        )}
      </div>

      {/* Основна сітка даних */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Блок 1: Telegram та зв'язок */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-sky-500" /> Акаунт Telegram
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-0.5">Username</label>
              <p className="text-sm font-medium">
                {manager.username ? `@${manager.username}` : <span className="text-muted-foreground italic text-xs">не вказано</span>}
              </p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-0.5">Telegram ID</label>
              <p className="text-sm font-mono tracking-tight">{manager.telegram_id}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-0.5">Ім'я в ТГ</label>
              <p className="text-sm font-medium">{manager.first_name || <span className="text-muted-foreground italic text-xs">немає даних</span>}</p>
            </div>
          </CardContent>
        </Card>

        {/* Блок 2: Активність та Робочий процес */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Статус та робочий процес
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Остання активність
              </span>
              <p className="text-sm font-medium">
                {manager.last_active 
                  ? new Date(manager.last_active).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" })
                  : <span className="text-muted-foreground italic text-xs">немає записів</span>
                }
              </p>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Activity className="h-3 w-3" /> Поточний етап / Стадія
              </span>
              <p className="text-sm font-medium">
                {manager.current_stage || <span className="text-muted-foreground italic text-xs">вільний / немає етапу</span>}
              </p>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border space-y-1 sm:col-span-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Дата реєстрації в системі
              </span>
              <p className="text-sm font-medium">
                {new Date(manager.created_at).toLocaleString("uk-UA", { dateStyle: "long", timeStyle: "short" })}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}