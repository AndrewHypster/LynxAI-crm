import { Suspense } from "react"
import StaffTable from "./staffTable"

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">Завантаження навігації...</div>
      }
    >
      <StaffTable />
    </Suspense>
  )
}
