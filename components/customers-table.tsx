"use client" // <--- ЦЕ ОБОВ'ЯЗКОВО ДЛЯ onClick

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Shield, Send, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useCallback, useState } from "react"
import { Lead, LEAD_ROLE_CONFIG, LEAD_STATUS_CONFIG, LeadRole } from "@/lib/constants"
import Link from "next/link"

// Описуємо інтерфейс для типізації (Senior style)
interface Customer {
  id: string
  username?: string | null // Це і є твій "телеграм" для лінку
  firstName: string // Додано
  lastName?: string | null // Додано
  telegram?: string | null
  phone?: string | null
  status: string
  role: string
}

type ModalConfig = {
  title: string
  field: "role" | "status"
  options: { label: string; value: string }[]
} | null

interface Client {
  id: string
  firstName: string
  lastName?: string
  role: LeadRole
  telegram?: string
}

interface CustomerRowProps {
  client: Lead
  onEdit: (client: Lead, field: "role" | "status") => void
  onDelete: (id: string) => void
  onWriteInTG: (telegram: string) => void
}

const CustomerRow = React.memo(
  ({ client, onEdit, onDelete, onWriteInTG }: CustomerRowProps) => {
    // 1. Отримуємо конфіг ролі ліда (BUYER, REALTOR тощо)
    const roleKey = client.role as string
    const config =
      roleKey in LEAD_ROLE_CONFIG
        ? LEAD_ROLE_CONFIG[roleKey as LeadRole]
        : LEAD_ROLE_CONFIG["UNDEFINED"] // Використовуй рядок, якщо LEAD_ROLES недоступний

    // 2. Отримуємо конфіг для СТАТУСУ (Ось чого не вистачало)
    const statusKey = (client.status ||
      "NEW") as keyof typeof LEAD_STATUS_CONFIG
    const statusConfig = LEAD_STATUS_CONFIG[statusKey] || LEAD_STATUS_CONFIG.NEW

    const RoleIcon = config.icon

    return (
      <TableRow className="transition-colors hover:bg-muted/50">
        <TableCell className="font-medium">
          <Link
            href={`/leads/${client.id}`}
            className="transition-colors hover:text-primary hover:underline"
          >
            {`${client.firstName} ${client.lastName || ""}`}
          </Link>
        </TableCell>

        {/* РОЛЬ ЛІДА (Покупець/Ріелтор) - робимо клікабельною для зміни */}
        <TableCell>
          <button
            onClick={() => onEdit(client as any, "role")} // Тимчасово any, поки типи не синхронізовані
            className="group flex cursor-pointer items-center gap-1.5 transition-transform active:scale-95"
          >
            <Badge
              variant="outline"
              className={`${config.css} border-current/20`}
            >
              <RoleIcon className="mr-1 size-3" />
              {config.label}
            </Badge>
          </button>
        </TableCell>

        {/* СТАТУС (тут була помилка в логіці, статус зазвичай окреме поле) */}
        <TableCell>
          <button
            onClick={() => onEdit(client, "status")}
            // Використовуємо statusConfig замість status
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-wider transition-all hover:opacity-80 active:scale-95 ${statusConfig.css}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </button>
        </TableCell>

        {/* ТЕЛЕГРАМ */}
        <TableCell>
          {client.telegram ? (
            <Button
              variant="link"
              className="h-auto p-0 font-normal text-blue-500"
              onClick={() => onWriteInTG(client.telegram)}
            >
              <Send className="mr-1 h-3 w-3" /> @{client.telegram}
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              не вказано
            </span>
          )}
        </TableCell>

        {/* ТЕЛЕФОН */}
        <TableCell>
          {(client as any).phone ? (
            <a
              href={`tel:${(client as any).phone}`}
              className="flex items-center text-sm transition-colors hover:text-primary"
            >
              <Phone className="mr-1 h-3 w-3 opacity-70" />{" "}
              {(client as any).phone}
            </a>
          ) : (
            "—"
          )}
        </TableCell>

        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(client.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  }
)

export function CustomersTable({ initialData }: { initialData: Lead[] }) {
  // Створюємо локальний стейт на основі вхідних даних
  const [tableData, setTableData] = useState<Lead[]>(initialData)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [modalConfig, setModalConfig] = useState<ModalConfig>(null)
  const [currentValue, setCurrentValue] = useState("")

  const handleDelete = (id: string) => {
    if (confirm("Видалити цього користувача?")) {
      setTableData(tableData.filter((user) => user.id !== id))
      // Тут буде Server Action для видалення з БД
    }
  }

  // Відкриття модалки
  const openEditModal = (user: Customer, field: "role" | "status") => {
    setSelectedUser(user)
    setCurrentValue(user[field])

    const config: Record<string, ModalConfig> = {
      role: {
        title: "Зміна ролі",
        field: "role",
        options: [
          { label: "Користувач", value: "USER" },
          { label: "Менеджер", value: "MANAGER" },
          { label: "Адміністратор", value: "ADMIN" },
        ],
      },
      status: {
        title: "Зміна статусу",
        field: "status",
        options: [
          { label: "Новий", value: "NEW" },
          { label: "Активний", value: "ACTIVE" },
          { label: "Завершено", value: "COMPLETED" },
          { label: "Заблоковано", value: "BANNED" },
        ],
      },
    }

    setModalConfig(config[field])
  }

  const handleWriteInTG = useCallback((username?: string | null) => {
    if (!username) return
    window.open(`https://t.me/${username}`, "_blank")
  }, [])

  // Універсальне збереження
  const handleSave = async () => {
    if (!selectedUser || !modalConfig) return

    // 1. ОНОВЛЮЄМО ЛОКАЛЬНИЙ СТЕЙТ (щоби в таблиці одразу змінилося)
    const updatedData = tableData.map((user) => {
      if (user.id === selectedUser.id) {
        // Повертаємо копію юзера з оновленим полем (role або status)
        return { ...user, [modalConfig.field]: currentValue }
      }
      return user
    })

    setTableData(updatedData) // Повідомляємо React, що треба перемалювати таблицю
    setModalConfig(null) // Закриваємо модалку

    console.log("Дані оновлено в інтерфейсі")

    // 2. ТУТ БУДЕ ЗАПИТ ДО БАЗИ (Prisma)
    // await updateInDatabase(selectedUser.id, { [modalConfig.field]: currentValue });
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ім'я та Прізвище</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Телеграм</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((client) => (
              <CustomerRow
                key={client.id}
                client={client}
                onDelete={handleDelete}
                onEdit={openEditModal} // теж загорни в useCallback
                onWriteInTG={handleWriteInTG}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* МОДАЛЬНЕ ВІКНО ЗМІНИ РОЛІ */}
      <Dialog open={!!modalConfig} onOpenChange={() => setModalConfig(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{modalConfig?.title}</DialogTitle>
            <DialogDescription>
              Встановіть нове значення для @
              {selectedUser?.username || "користувача"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={currentValue} onValueChange={setCurrentValue}>
              <SelectTrigger>
                <SelectValue placeholder="Виберіть значення" />
              </SelectTrigger>
              <SelectContent>
                {modalConfig?.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalConfig(null)}>
              Скасувати
            </Button>
            <Button onClick={handleSave}>Зберегти зміни</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
