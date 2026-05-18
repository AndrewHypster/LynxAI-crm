import { Suspense } from "react"
import LeadsTable from "./leadsTable"


// 1. Головний експорт сторінки стає просто тонкою обгорткою з Suspense
export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">Завантаження навігації...</div>
      }
    >
      <LeadsTable />
    </Suspense>
  )
}
