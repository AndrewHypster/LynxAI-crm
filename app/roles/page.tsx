import { ShieldAlert, ShieldCheck, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const rolesInfo = [
  {
    title: "Creator",
    icon: <ShieldAlert className="h-6 w-6 text-destructive" />,
    description: "Повний доступ до системи LynxAI.",
    capabilities: [
      "Статистика бізнесів",
      "Редагування підписок",
      "Перегляд фінансової аналітики",
    ],
    color: "border-l-4 border-l-destructive",
  },
  {
    title: "Admin",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    description: "Головний бізнесу",
    capabilities: [
      "Створення біснесів",
      "Оплата підписки",
      "Керування менеджерами",
      "Розподіл лідів по менеджерам",
      "Обробка лідів",
    ],
    color: "border-l-4 border-l-primary",
  },
  {
    title: "Manager",
    icon: <User className="h-6 w-6 text-muted-foreground" />,
    description: "Стандартна роль для всіх клієнтів бота.",
    capabilities: [
      "Обробка лідів",
    ],
    color: "border-l-4 border-l-muted",
  },
]

export default function RolesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ієрархія ролей</h1>
        <p className="text-muted-foreground">
          Опис прав доступу в системі CRM.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {rolesInfo.map((role) => (
          <Card key={role.title} className={role.color}>
            <CardHeader className="flex flex-row items-center space-x-4">
              {role.icon}
              <CardTitle className="text-lg">{role.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm font-semibold">{role.description}</p>
              <ul className="space-y-2">
                {role.capabilities.map((cap, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-muted-foreground"
                  >
                    <span className="mr-2 text-primary">•</span>
                    {cap}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
