// components/dashboard/manager-info.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ManagerHeaderProps {
  user:
    | {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string | null // Додаємо роль, бо вона нам потрібна для LynxAI
      }
    | undefined
}

export function ManagerHeader({ user }: ManagerHeaderProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{user?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Менеджер | LynxAI</p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Ваш Адміністратор
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-bold">Олександр (Admin)</p>
          <p className="text-xs text-blue-500">tg: @admin_lynx</p>
        </CardContent>
      </Card>
    </div>
  )
}
