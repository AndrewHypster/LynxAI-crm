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
import { STATUS_CONFIG, ROLE_CONFIG } from "@/lib/constants"

// Описуємо інтерфейс для типізації (Senior style)
interface Customer {
  id: string
  username?: string | null // Це і є твій "телеграм" для лінку
  firstName: string // Додано
  lastName?: string | null // Додано
  phone?: string | null
  status: string
  role: string
}

type ModalConfig = {
  title: string
  field: "role" | "status"
  options: { label: string; value: string }[]
} | null

interface CustomerRowProps {
  client: Customer
  onEdit: (user: Customer, field: "role" | "status") => void
  onDelete: (id: string) => void
  onWriteInTG: (username?: string | null) => void // Додай в інтерфейс
}

const CustomerRow = React.memo(
  ({ client, onEdit, onDelete, onWriteInTG }: CustomerRowProps) => {
    // Виносимо конфіги для чистішого JSX
    const status = STATUS_CONFIG[client.status as keyof typeof STATUS_CONFIG]
    const role = ROLE_CONFIG[client.role as keyof typeof ROLE_CONFIG]

    return (
      <TableRow className="transition-colors hover:bg-muted/50">
        <TableCell className="font-medium">
          {`${client.firstName} ${client.lastName || ""}`.trim()}
        </TableCell>

        {/* РОЛЬ */}
        <TableCell>
          <button
            onClick={() => onEdit(client, "role")}
            className="group flex cursor-pointer items-center gap-1"
          >
            <Shield
              className={`h-3 w-3 opacity-50 group-hover:opacity-100 ${role.iconColor}`}
            />
            <span
              className={`text-sm underline decoration-dotted underline-offset-4 ${role.color}`}
            >
              {client.role}
            </span>
          </button>
        </TableCell>

        {/* СТАТУС */}
        <TableCell>
          <button
            onClick={() => onEdit(client, "status")}
            className="cursor-pointer transition-transform active:scale-95"
          >
            <Badge variant="outline" className={`gap-1.5 ${status.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {client.status}
            </Badge>
          </button>
        </TableCell>

        {/* ТЕЛЕГРАМ */}
        <TableCell>
          {client.username ? (
            <Button
              variant="link"
              className="h-auto p-0 font-normal"
              onClick={() => onWriteInTG(client.username)} // Викликаємо через пропс
            >
              <Send className="mr-1 h-3 w-3" /> @{client.username}
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              не вказано
            </span>
          )}
        </TableCell>

        {/* ТЕЛЕФОН */}
        <TableCell>
          {client.phone ? (
            <a
              href={`tel:${client.phone}`}
              className="flex items-center text-sm transition-colors hover:text-primary"
            >
              <Phone className="mr-1 h-3 w-3 opacity-70" /> {client.phone}
            </a>
          ) : (
            "—"
          )}
        </TableCell>

        {/* ВИДАЛЕННЯ */}
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(client.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  }
)

export function CustomersTable({ initialData }: { initialData: Customer[] }) {
  // Створюємо локальний стейт на основі вхідних даних
  const [tableData, setTableData] = useState(initialData)
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
