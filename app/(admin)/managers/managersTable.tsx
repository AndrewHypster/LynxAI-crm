"use client"

import { managerColumns } from "@/components/columns/managers"
import { PageLoader } from "@/components/loading"
import { EmptyTable, UniversalTable } from "@/components/table"
import { User } from "@/lib/constants"
import {
  usePathname,
  useSearchParams,
  useRouter,
  redirect,
} from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function ManagersTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page")) || 1
  const limit = 25

  const [isLoading, setIsLoading] = useState(true)
  const [user, setUsers] = useState<User[]>([])
  const usersCache = useRef<{ [key: number]: User[] }>({})
  const [totalPages, setTotalPages] = useState<number>(0)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      
      if (totalPages != 0 && page > totalPages) redirect("/404")
      if (usersCache.current[page]) {
        setUsers(usersCache.current[page])
         setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/v1/users?page=${page}&limit=${limit}`)
        console.log(res);
        
        if (!res.ok) throw new Error(`Помилка сервера: ${res.status};
        }`)

        const responseData = await res.json()
        const fetchedUsers = responseData.data || []
        const serverTotalPages = responseData.meta?.pages || 1

        // 2. Якщо сервер повернув нову кількість сторінок, яка відрізняється від нашої —
        // м'яко оновлюємо стейт, кеш при цьому не страждає.
        if (serverTotalPages !== totalPages) {
          setTotalPages(serverTotalPages)
        }

        // 3. Записуємо в кеш тільки масив лідів для цієї сторінки (навіть якщо він порожній)
        usersCache.current[page] = fetchedUsers
        setUsers(fetchedUsers)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Юзери</h1>
      </div>

      {isLoading && <PageLoader />}

      {!isLoading && user && page > totalPages ? (
        <EmptyTable
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      ) : (
        <UniversalTable<User>
          data={user as User[]}
          columns={managerColumns}
          onChange={async ({ id, key, value }) => {
            // 1. Формуємо тіло запиту динамічно: { [key]: value }
            // Наприклад, якщо міняємо роль: { role: "partner" }
            const requestBody = { [key]: value }

            try {
              // 2. Шлемо запит на твій новий захищений API-роут
              const res = await fetch(`/api/v1/users/${id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
              })

              const data = await res.json()

              // 3. Якщо наш бекенд (з валідацією Zod/Схемою) повернув помилку (наприклад, 400 Bad Request)
              if (!res.ok) {
                throw new Error(
                  data.error || "Не вдалося оновити дані на сервері"
                )
              }

              // 4. ТІЛЬКИ ЯКЩО СЕРВЕР ПОВЕРНУВ 200 ОК — оновлюємо стейт і кеш
              setUsers((prev) => {
                const updated = prev.map((item) =>
                  String(item.id) === String(id)
                    ? { ...item, ...data } // Бекенд повертає оновлений об'єкт, мержимо його
                    : item
                )
                
                usersCache.current[page] = updated
                return updated
              })

              // Тут можна тригернути якийсь красивий Toast про успіх
              // toast.success("Зміни збережено")
            } catch (error: any) {
              console.error("Помилка під час PATCH запиту:", error)
              // Тут обов'язково показуємо юзеру помилку валідації або авторизації
              alert(`Помилка оновлення: ${error.message}`)
            }
          }}
          pagination={{
            currentPage: page,
            pageSize: limit,
            pages: totalPages,
            onPageChange: handlePageChange,
            isNextDisabled: page >= totalPages,
          }}
        />
      )}
    </div>
  )
}
