"use client"
import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, Users, Shield, RefreshCcw } from "lucide-react"
import { STATUS_CONFIG, ROLE_CONFIG } from "@/lib/constants"

export default function BroadcastPage() {
  const [message, setMessage] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  // Логіка вибору (Toggle)
  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  const selectAll = () => {
    setSelectedRoles(Object.keys(ROLE_CONFIG))
    setSelectedStatuses(Object.keys(STATUS_CONFIG))
  }

  const clearFilters = () => {
    setSelectedRoles([])
    setSelectedStatuses([])
  }

  const handleSend = () => {
    const payload = {
      message,
      filters: {
        roles: selectedRoles,
        statuses: selectedStatuses,
        all: selectedRoles.length === 0 && selectedStatuses.length === 0,
      },
    }
    console.log("Відправка розсилки:", payload)
    // Тут буде виклик API: await sendBroadcast(payload)
    alert("Розсилку запущено!")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Розсилка</h1>
        <p className="text-muted-foreground">
          Надішліть повідомлення користувачам через Telegram бот.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Фільтри */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" /> Ролі
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${key}`}
                    checked={selectedRoles.includes(key)}
                    onCheckedChange={() => toggleRole(key)}
                  />
                  <label
                    htmlFor={`role-${key}`}
                    className="cursor-pointer text-sm"
                  >
                    {config.label}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <RefreshCcw className="h-4 w-4" /> Статуси
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${key}`}
                    checked={selectedStatuses.includes(key)}
                    onCheckedChange={() => toggleStatus(key)}
                  />
                  <label
                    htmlFor={`status-${key}`}
                    className="cursor-pointer text-sm"
                  >
                    {config.label}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Вибрати всіх
            </Button>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Скинути фільтри
            </Button>
          </div>
        </div>

        {/* Контент розсилки */}
        <div className="space-y-6 md:col-span-2">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Повідомлення</CardTitle>
              <CardDescription>
                Це повідомлення отримають
                <span className="mx-1 font-bold text-primary">
                  {selectedRoles.length === 0 && selectedStatuses.length === 0
                    ? " всі користувачі"
                    : " вибрані сегменти"}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <Textarea
                placeholder="Введіть текст повідомлення..."
                className="min-h-[200px] resize-none text-base"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex flex-wrap gap-2">
                {selectedRoles.map((r) => (
                  <Badge key={r} variant="secondary">
                    {ROLE_CONFIG[r as keyof typeof ROLE_CONFIG].label}
                  </Badge>
                ))}
                {selectedStatuses.map((s) => (
                  <Badge
                    key={s}
                    className={
                      STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].color
                    }
                  >
                    {STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
                  </Badge>
                ))}
              </div>

              <Button
                className="h-12 w-full gap-2 text-lg"
                disabled={!message.trim()}
                onClick={handleSend}
              >
                <Send className="h-5 w-5" /> Запустити розсилку
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
