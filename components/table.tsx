"use client"

import { LEAD_STATUS_CONFIG } from "@/lib/constants"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Badge } from "./ui/badge"
import { useEffect, useState } from "react"

export interface ColumnConfig<T> {
  header: string // Назва в шапці
  key: keyof T | string // Ключ у даних
  type: "text" | "badge-icon" | "badge-dot" | "custom"
  config?: Record<string, { label?: string; icon?: any; css?: string }>
  className?: string
  render?: (item: T, actions?: any) => React.ReactNode
}

interface UniversalTableProps<T> {
  data: T[]
  columns: ColumnConfig<T>[]
  onDelete?: (id: string | number) => void
}

interface ModalProps {
  id: string | number
  title: string
  colKey: string | number | symbol //string
  username: string
  currentValue: string
  options: { value: string; label: string }[]
}

const TextCell = ({ value }: { value: any }) => (
  <span className="text-sm text-foreground">{value}</span>
)

const BadgeIconCell = ({
  value,
  config,
  onClick,
}: {
  value: any
  config: any
  onClick?: () => void
}) => {
  config = config[value.role]
  const RoleIcon = config.icon

  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-1.5 transition-transform active:scale-95"
    >
      <Badge variant="outline" className={`${config.css} border-current/20`}>
        <RoleIcon className="mr-1 size-3" />
        {config.label}
      </Badge>
    </button>
  )
}

export function UniversalTable<
  T extends {
    id: string | number
    firstName: string
    lastName: string
    phone: string
    role: string
    status: string
    telegram: string
  },
  >({ data, columns, onDelete }: UniversalTableProps<T>) {
  const [users, setUsers] = useState(data)
  const [modal, setModal] = useState<ModalProps | null>(null)

  const handleDelete = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation() // Важливо: щоб не спрацював перехід по кліку на рядок

    if (confirm("Ви впевнені, що хочете видалити цей запис?")) {
      onDelete?.(id)
    }
  }

  const handleSave = () => {
    if (!modal || !modal.id) return

    const newValue = modal.currentValue

    // 1. Оновлюємо стейт даних (наприклад, leads)
    setUsers((prev) =>
      prev.map(
        (item) =>
          item.id === modal.id
            ? { ...item, [modal.colKey]: newValue } // Створюємо новий об'єкт ТІЛЬКИ для цього рядка
            : item // Інші об'єкти залишаються тими самими (referential equality)
      )
    )

    // 2. Закриваємо модалку
    setModal(null)
  }

  const openModal = ({
    id,
    title,
    colKey,
    username,
    currentValue,
    options,
  }: ModalProps) => {
    setModal({ id, title, colKey, username, currentValue, options })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col, i) => (
                <TableCell className={col.className} key={i}>
                  {(() => {
                    // 1. Пріоритет у кастомного рендеру (якщо він прописаний)
                    if (col.render) return col.render(item)

                    const value = item[col.key as keyof T]

                    // 2. Рендер на основі типу
                    switch (col.type) {
                      case "badge-icon":
                        return (
                          <BadgeIconCell
                            value={item}
                            config={col.config}
                            onClick={() => {
                              openModal({
                                id: item.id,
                                title: col.header,
                                colKey: col.key,
                                currentValue: item.role,
                                username: `${item.firstName} ${item.lastName}`,
                                options: Object.entries(col.config || {}).map(
                                  ([key, info]: any) => ({
                                    value: key,
                                    label: info.label,
                                  })
                                ),
                              })
                            }}
                          />
                        )
                        break

                      case "text":
                        return <TextCell value={value} />
                        break
                    }
                  })()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* МОДАЛЬНЕ ВІКНО ЗМІНИ РОЛІ */}
      {modal && (
        <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{modal?.title}</DialogTitle>
              <DialogDescription>
                Встановіть нове значення для {modal.username || "користувача"}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Select
                value={modal.currentValue}
                onValueChange={(val) =>
                  setModal((prev) =>
                    prev ? { ...prev, currentValue: val } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть значення" />
                </SelectTrigger>
                <SelectContent>
                  {modal.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setModal(null)}>
                Скасувати
              </Button>
              <Button onClick={handleSave}>Зберегти зміни</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
