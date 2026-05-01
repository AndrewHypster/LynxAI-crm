import { ManagerHeader } from "@/components/dashboard/manager-info"
import { StatsCards } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LeadsChart } from "@/components/dashboard/leads-chart"

interface ManagerDashboardProps {
  user: {
    name?: string | null
    role: string
    companyId?: string | null
  }
}

export default async function ManagerDashboard({ user }: ManagerDashboardProps) {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Робочий стіл</h1>

      {/* Інфо про менеджера */}
      <ManagerHeader user={user} />

      {/* Картки статистики */}
      <StatsCards />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Графік */}
        <LeadsChart />

        {/* Тут можна додати список останніх лідів */}
        <Card>
          <CardHeader>
            <CardTitle>Останні дії</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Тут буде список останніх доданих лідів...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
