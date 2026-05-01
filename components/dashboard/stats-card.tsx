import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

// components/dashboard/stats-cards.tsx
export function StatsCards() {
  const stats = [
    {
      title: "Всього лідів",
      value: "124",
      description: "+12% з минулого тижня",
    },
    {
      title: "Покупці",
      value: "89",
      description: "72% від загальної кількості",
    },
    { title: "Ріелтори", value: "24", description: "Активні партнери" },
    { title: "Невизначено", value: "11", description: "Потребують уточнення" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {s.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
            <p className="text-xs text-muted-foreground">{s.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
