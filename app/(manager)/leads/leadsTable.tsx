"use client"

import { leadColumns } from "@/components/columns/leads"
import { PageLoader } from "@/components/loading"
import { EmptyTable, UniversalTable } from "@/components/table"
import { Lead } from "@/lib/constants"
import {
  usePathname,
  useSearchParams,
  useRouter,
  redirect,
} from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function LeadsTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  const [isLoading, setIsLoading] = useState(true)
  const [leads, setLeads] = useState<Lead[]>([])
  const leadsCache = useRef<{ [key: number]: { data: Lead[] } }>({})
  const [totalPages, setTotalPages] = useState<number>(0)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    const loadLeads = async () => {
      setIsLoading(true)
      if (totalPages != 0 && page > totalPages) redirect("/404")
      if (leadsCache.current[page]) {
        setLeads(leadsCache.current[page].data)
        return
      }

      try {
        const res = await fetch(`/api/v1/leads?page=${page}&limit=${limit}`)
        console.log(res);
        
        if (!res.ok) throw new Error(`Помилка сервера: ${res.status};
        }`)

        const responseData = await res.json()
        const fetchedLeads = responseData.data || []
        const serverTotalPages = responseData.meta?.pages || 1

        // 2. Якщо сервер повернув нову кількість сторінок, яка відрізняється від нашої —
        // м'яко оновлюємо стейт, кеш при цьому не страждає.
        if (serverTotalPages !== totalPages) {
          setTotalPages(serverTotalPages)
        }

        // 3. Записуємо в кеш тільки масив лідів для цієї сторінки (навіть якщо він порожній)
        leadsCache.current[page] = fetchedLeads
        setLeads(fetchedLeads)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeads()
  }, [page])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ліди</h1>
      </div>

      {isLoading && <PageLoader />}

      {!isLoading && leads.length === 0 && page > totalPages ? (
        <EmptyTable
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      ) : (
        <UniversalTable<Lead>
          data={leads as Lead[]}
          columns={leadColumns}
          onChange={({ id, key, value }) =>
            setLeads((prev) => {
              const updated = prev.map((item) =>
                String(item.id) === String(id)
                  ? { ...item, [key]: value }
                  : item
              )

              // Оновлюємо кеш для поточної сторінки, щоб там лежали актуальні змінені дані
              leadsCache.current[page].data = updated
              return updated
            })
          }
          pagination={{
            currentPage: page,
            pageSize: limit,
            onPageChange: handlePageChange,
            isNextDisabled: page >= totalPages,
          }}
        />
      )}
    </div>
  )
}
