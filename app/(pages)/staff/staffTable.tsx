"use client"

import { staffColumns } from "@/components/columns/staff"
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

export default function StaffTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page")) || 1
  const limit = 25

  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
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
        const res = await fetch(`/api/v1/staff?page=${page}&limit=${limit}`)
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
        console.log("USERS", fetchedUsers);
        
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
        <h1 className="text-3xl font-bold tracking-tight">Штат компанії</h1>
      </div>

      {isLoading && <PageLoader />}

      {!isLoading && users && page > totalPages ? (
        <EmptyTable
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      ) : (
        <UniversalTable<User>
  data={users}
  columns={staffColumns}
  onChange={async ({ id, key, value }) => {
    const requestBody = { [key]: value }

    try {
      const res = await fetch(`/api/v1/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const resJson = await res.json() // Перейменував для ясності

      if (!res.ok) {
        throw new Error(resJson.error || "Не вдалося оновити дані на сервері")
      }
      
      setUsers((prev) => {
        const updated = prev.map((item) =>
          String(item.id) === String(id)
            ? { ...item, ...resJson.data } // 2. ПРАВИЛЬНО: беремо вкладений об'єкт data
            : item
        )
        
        usersCache.current[page] = updated
        return updated
      })

    } catch (error: any) {
      console.error("Помилка під час PATCH запиту:", error)
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
