import {
  DollarSign,
  MapPin,
  BedDouble,
  Sparkles,
  CheckCircle2,
  Home,
  Phone,
  Send,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LEAD_STATUS_CONFIG, LEAD_ROLE_CONFIG } from "@/lib/constants"

const lead = {
  id: "24",
  firstName: "Ірина",
  lastName: "Терещенко",
  role: "BUYER",
  status: "ACTIVE",
  telegram: "ira_ter",
  phone: "+380632221100",
  budget: 1000,
  intent: "RENT",
  location: "Ternopil",
  rooms: 4,
  hasBenefits: true,
  amenities: ["Паркінг", "Балкон"],
  aiSummary:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, earum qui est soluta suscipit eveniet eum quos porro delectus veniam, commodi possimus illum maiores, minima culpa debitis provident dolor tempore labore id! Nobis dolorum a voluptates alias, hic dicta unde nisi harum ipsa, pariatur quam autem natus quo, nihil tempore culpa! Eum cumque voluptates id quaerat ipsum itaque distinctio ut nam animi dolore ea, ab necessitatibus optio corrupti at explicabo!",
}

export default async function LeadFullDetails() {
  // Отримуємо конфіги для гарного відображення статусу та ролі
  const status =
    LEAD_STATUS_CONFIG[lead.status as keyof typeof LEAD_STATUS_CONFIG] ||
    LEAD_STATUS_CONFIG.NEW
  const role =
    LEAD_ROLE_CONFIG[lead.role as keyof typeof LEAD_ROLE_CONFIG] ||
    LEAD_ROLE_CONFIG.UNDEFINED

  return (
    <div className="space-y-6 p-6">
      {/* ХЕДЕР З ОСНОВНОЮ ІНФОЮ */}
      <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-slate-100 text-slate-600">
            <User className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {lead.firstName} {lead.lastName || ""}
            </h1>
            <p className="text-sm text-muted-foreground">ID: {lead.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* РОЛЬ */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${role.css}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${role.dot}`} />
            {role.label.toUpperCase()}
          </div>
          {/* СТАТУС */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.css}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* 1. КОНТАКТНА ІНФОРМАЦІЯ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
              Контакти
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Send className="size-4 text-sky-500" /> Telegram
              </span>
              <a
                href={`https://t.me/${lead.telegram}`}
                target="_blank"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                @{lead.telegram}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 text-emerald-500" /> Телефон
              </span>
              <span className="text-sm font-medium">
                {lead.phone || "Не вказано"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2. ПАРАМЕТРИ ЗАПИТУ */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
              Деталі нерухомості
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="size-4" /> Бюджет
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  ${lead.budget?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="size-4" /> Тип
                </span>
                <span className="text-sm font-medium">
                  {lead.intent === "BUY" ? "Купівля" : "Оренда"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" /> Локація
                </span>
                <span className="text-sm font-medium">{lead.location}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BedDouble className="size-4" /> Кімнат
                </span>
                <span className="text-sm font-medium">{lead.rooms}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. ШІ АНАЛІЗ (На всю ширину) */}
        <Card className="border-primary/20 bg-slate-50/50 md:col-span-3">
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2 text-primary">
              <Sparkles className="size-5" />
              AI Резюме клієнта
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 italic">
                {lead.aiSummary ||
                  "Дані для аналізу відсутні. ШІ сформує опис після першої переписки."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2
                  className={`size-4 ${lead.hasBenefits ? "text-blue-500" : "text-slate-300"}`}
                />
                Соціальні пільги:{" "}
                <span className="font-bold">
                  {lead.hasBenefits ? "ТАК" : "НІ"}
                </span>
              </div>
              {lead.amenities?.map((a: string) => (
                <Badge
                  key={a}
                  variant="outline"
                  className="bg-white text-[10px] tracking-tight uppercase"
                >
                  {a}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
