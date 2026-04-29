import { ShieldAlert, ShieldCheck, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const rolesInfo = [
  {
    title: "Адміністратор (ADMIN)",
    icon: <ShieldAlert className="h-6 w-6 text-destructive" />,
    description: "Повний доступ до системи LynxAI.",
    capabilities: [
      "Керування ролями всіх користувачів",
      "Видалення записів з бази даних",
      "Перегляд фінансової аналітики",
      "Доступ до технічних логів та API налаштувань",
    ],
    color: "border-l-4 border-l-destructive",
  },
  {
    title: "Менеджер (MANAGER)",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    description: "Операційне керування клієнтами та замовленнями.",
    capabilities: [
      "Зміна статусів клієнтів (Active/Banned/Completed)",
      "Комунікація з клієнтами через Telegram",
      "Перегляд контактних даних користувачів",
      "Обробка вхідних запитів у боті",
    ],
    color: "border-l-4 border-l-primary",
  },
  {
    title: "Користувач (USER)",
    icon: <User className="h-6 w-6 text-muted-foreground" />,
    description: "Стандартна роль для всіх клієнтів бота.",
    capabilities: [
      "Доступ до функціоналу бота (Etno Shop тощо)",
      "Можливість залишати контактні дані",
      "Перегляд власних замовлень та схем",
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
