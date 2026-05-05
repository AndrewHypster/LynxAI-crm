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
      //onClick={() => onEdit(client as any, "role")} // Тимчасово any, поки типи не синхронізовані
      className="group flex cursor-pointer items-center gap-1.5 transition-transform active:scale-95"
    >
      <Badge variant="outline" className={`${config.css} border-current/20`}>
        <RoleIcon className="mr-1 size-3" />
        {config.label}
      </Badge>
    </button>
  )
}

export function UniversalTable<T extends { id: string | number }>({
  data,
  columns,
  onDelete,
}: UniversalTableProps<T>) {
  const handleDelete = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation() // Важливо: щоб не спрацював перехід по кліку на рядок

    if (confirm("Ви впевнені, що хочете видалити цей запис?")) {
      onDelete?.(id)
    }
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
          {data?.map((item) => (
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
                        {
                          const itemConfig = col.config
                            ? col.config[String(value)]
                            : null

                          return (
                            <BadgeIconCell
                              value={item}
                              config={col.config}
                            />
                          )
                        }
                        break;

                      case "text":
                        return <TextCell value={value} />
                        break;
                    }
                  })()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* МОДАЛЬНЕ ВІКНО ЗМІНИ РОЛІ */}
      {/* <Dialog open={!!modalConfig} onOpenChange={() => setModalConfig(null)}>
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
      </Dialog> */}
    </>
  )
}
