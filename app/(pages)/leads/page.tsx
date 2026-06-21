import { Suspense } from "react"
import LeadsTable from "./leadsTable"

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
