"use client"

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
import React, { useEffect, useState } from "react"

export interface ColumnConfig<T> {
  header: string // Назва в шапці
  key: keyof T | string // Ключ у даних
  type: "text" | "badge-icon" | "badge-dot" | "custom"
  config?: Record<string, { label?: string; icon?: any; css?: string }>
  className?: string
  render?: (item: any, actions?: any) => React.ReactNode
}

interface UniversalTableProps<T> {
  data: any[]
  columns: ColumnConfig<T>[]

  onChange: ({
    id,
    key,
    value,
  }: {
    id: string
    key: string
    value: string
  }) => void

  pagination?: {
    currentPage: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
    isNextDisabled:boolean
  }
}

interface BaseEntity {
  id: string | number
  firstName?: string | null // Додаємо | null
  lastName?: string | null // Додаємо | null
  role?: string | null // Додаємо | null
}

interface ModalProps {
  id: string
  title: string
  colKey: string
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
  colKey,
  onClick,
}: {
  value: any
  config: any
  colKey: any
  onClick?: () => void
}) => {
  config = config[value[colKey]]
  const Icon = config?.icon

  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-1.5 transition-transform active:scale-95"
    >
      <Badge variant="outline" className={`${config?.css} border-current/20`}>
        {config && <Icon className="mr-1 size-3" />}
        {config?.label}
      </Badge>
    </button>
  )
}

const BadgeDotCell = ({
  value,
  config,
  colKey,
  onClick,
}: {
  value: any
    config: any
  colKey: any
  onClick?: () => void
  }) => {
  
  config = config[value[colKey]]
  

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-wider transition-all hover:opacity-80 active:scale-95 ${config?.css}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config?.dot}`} />
      {config?.label}
    </button>
  )
}

const TableRowMemo = React.memo(
  <T extends BaseEntity>({
    columns,
    item,
    openModal,
  }: {
    columns: ColumnConfig<T>[]
    item: T
    openModal: any
  }) => (
    <TableRow>
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
                    colKey={col.key}
                    onClick={() => {
                      openModal({
                        id: item.id as string,
                        title: col.header,
                        colKey: col.key as string,
                        currentValue: item[col.key as keyof typeof item],
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

              case "badge-dot":
                return (
                  <BadgeDotCell
                    value={item}
                    config={col.config}
                    colKey={col.key}
                    onClick={() => {
                      openModal({
                        id: item.id as string,
                        title: col.header,
                        colKey: col.key as string,
                        currentValue: item[col.key as keyof typeof item],
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
            }
          })()}
        </TableCell>
      ))}
    </TableRow>
  )
) as <T extends BaseEntity>(props: {
  columns: ColumnConfig<T>[]
  item: T
  openModal: any
}) => React.ReactElement

export function UniversalTable<T extends BaseEntity>({
  data,
  columns,
  onChange,
  pagination
}: UniversalTableProps<T>) {
  const [modal, setModal] = useState<ModalProps | null>(null)

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
          {data?.map((item, key) => (
            <TableRowMemo
              key={item.id}
              columns={columns}
              item={item}
              openModal={openModal}
            />
          ))}
        </TableBody>
      </Table>

      {/* ПАНЕЛЬ ПАГІНАЦІЇ */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              disabled={pagination.currentPage === 1}
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
            >
              Назад
            </Button>
            <Button
              variant="outline"
              disabled={pagination.isNextDisabled}
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
            >
              Вперед
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Поточна сторінка{" "}
                <span className="font-medium">{pagination.currentPage}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
              >
                Попередня
              </Button>
              <Button
                variant="outline"
                size="sm"
                // Якщо бек не дає totalCount, блокуємо кнопку, якщо прийшло менше елементів, ніж pageSize
                disabled={data.length < pagination.pageSize}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
              >
                Наступна
              </Button>
            </div>
          </div>
        </div>
      )}

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
              <Button
                onClick={() => {
                  onChange({
                    id: modal.id,
                    key: modal.colKey,
                    value: modal.currentValue,
                  })
                  setModal(null)
                }}
              >
                Зберегти зміни
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export const EmptyTable = ({
  page,
  totalPages,
  handlePageChange,
}: {
  page: number
  totalPages: number
  handlePageChange: (page: number) => void
}) => {
  return (
    <div className="my-4 rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-8 text-center">
      <div className="mb-2 text-lg font-semibold text-red-500">
        ⚠ Помилка навігації
      </div>
      <p className="text-sm text-gray-600">
        Ви перейшли на сторінку{" "}
        <span className="font-bold text-red-600">{page}</span>, але в базі даних
        зараз доступно всього{" "}
        <span className="font-semibold text-gray-900">{totalPages}</span>{" "}
        сторінок.
      </p>
      <button
        onClick={() => handlePageChange(1)}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700"
      >
        Повернутися на 1 сторінку
      </button>
    </div>
  )
}
