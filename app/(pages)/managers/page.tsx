import { Suspense } from "react"
import ManagersTable from "./managersTable"

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">Завантаження навігації...</div>
      }
    >
      <ManagersTable />
    </Suspense>
  )
}
