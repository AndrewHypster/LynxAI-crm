"use client"

import { Shield, Send, Clock, Calendar, Activity, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface Staff {
  id: number
  telegram_id: number
  username: string | null
  telegram_username: string | null
  first_name: string | null
  full_name: string | null
  role: string
  permissions: string | null
  created_at: string
  last_active: string | null
  current_stage: string | null
}

export default function StaffProfileView() {
  const params = useParams()
  const id = params.id as string
  const [user, setUser] = useState<Staff | null>(null)
  // Ініціали для аватарки (якщо немає full_name — беремо першу літеру чи за замовчуванням 'М')

  useEffect(() => {
    if (!id) return

    const fetchLeadData = async () => {
      try {
        // setLoading(true)
        // setError(null)
        const res = await fetch(`/api/v1/staff/${id}`)
        if (!res.ok) throw new Error(`Помилка завантаження ліда: ${res.status}`)

        const data = await res.json()
        setUser(data)
      } catch (err: any) {
        console.error(err)
        // setError(err.message || "Сталася помилка")
      } finally {
        // setLoading(false)
      }
    }

    fetchLeadData()
  }, [id])

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      {user && (
        <>
          <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                  {user ? user.username?.split("")[0].toLocaleUpperCase() : " "}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">
                    {user?.username || "Користувач без імені"}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="border-blue-200 bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    {user?.role}
                  </Badge>
                </div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Hash className="h-3 w-3" /> ID: {user?.id}
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full md:w-auto"
            >
              {user.telegram_username ? (
                <a
                  href={`https://t.me/${user.telegram_username.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Send className="mr-2 h-4 w-4 text-sky-500" />
                  Написати в Telegram
                </a>
              ) : (
                <p>
                  <Send className="mr-2 h-4 w-4 text-sky-500" />
                  tg user name null
                </p>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Send className="h-4 w-4 text-sky-500" /> Акаунт Telegram
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-0.5 block text-xs text-muted-foreground">
                    Telegram ID
                  </label>
                  <p className="font-mono text-sm tracking-tight">
                    {user?.telegram_id}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Activity className="h-4 w-4 text-emerald-500" /> Статус та
                  робочий процес
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1 rounded-lg border bg-muted/40 p-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> Остання активність
                  </span>
                </div>

                <div className="space-y-1 rounded-lg border bg-muted/40 p-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" /> Дозволи
                  </span>
                  {/* <p className="text-sm font-medium">
                {user?.permissions || <span className="text-muted-foreground italic text-xs">null</span>}
              </p> */}
                </div>

                <div className="space-y-1 rounded-lg border bg-muted/40 p-3 sm:col-span-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Дата реєстрації в системі
                  </span>
                  <p className="text-sm font-medium">
                    {new Date(user?.created_at).toLocaleString("uk-UA", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
