import {
  UserPlus,
  CheckCircle2,
  Ban,
  PackageCheck,
  LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LEAD_STATUS_CONFIG } from "@/lib/constants"

// Мапимо іконки до статусів
// const STATUS_ICONS: Record<string, LucideIcon> = {
//   NEW: UserPlus,
//   ACTIVE: CheckCircle2,
//   COMPLETED: PackageCheck,
//   BANNED: Ban,
// }

// const statusesInfo = [
//   {
//     status: "NEW",
//     description: "Користувач щойно зареєструвався в боті або системі.",
//     action:
//       "Менеджер повинен зв'язатися протягом 15 хвилин для уточнення замовлення.",
//   },
//   {
//     status: "ACTIVE",
//     description:
//       "Клієнт у процесі вибору товару або обговорення схеми вишивки.",
//     action: "Допомога з вибором дизайну для подушок або одягу.",
//   },
//   {
//     status: "COMPLETED",
//     description: "Замовлення виконано, клієнт отримав свою схему чи товар.",
//     action: "Можна пропонувати участь у програмі лояльності Etno Shop.",
//   },
//   {
//     status: "BANNED",
//     description: "Користувач порушив правила або спамив у боті.",
//     action: "Обмеження доступу до LynxAI та всіх сервісів магазину.",
//   },
// ]

export default function StatusesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">Статуси клієнтів</h1>
        <p className="text-muted-foreground">
          Життєвий цикл користувача в системі LynxAI.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {statusesInfo.map((item) => {
          // Отримуємо глобальні налаштування кольорів для цього статусу
          const config =
            LEAD_STATUS_CONFIG[item.status as keyof typeof LEAD_STATUS_CONFIG]
          const Icon = STATUS_ICONS[item.status] || CheckCircle2

          return (
            <Card
              key={item.status}
              className="overflow-hidden border-2 transition-all hover:border-primary/30"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`h-6 w-6 ${config.dot.replace("bg-", "text-")}`}
                  />
                  <CardTitle className="text-xl font-bold">
                    {config.label}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={`${config.css} border-none shadow-none`}
                >
                  {item.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {item.description}
                  </p>
                  <div className="rounded-lg border border-dashed border-primary/20 bg-muted/50 p-3">
                    <p className="mb-1 text-xs font-bold text-primary uppercase">
                      Інструкція для менеджера:
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {item.action}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div> */}
    </div>
  )
}
