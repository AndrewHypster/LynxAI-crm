"use client"

import React, { useEffect, useState } from "react"
import { 
  Key, Copy, Check, Eye, EyeOff, RefreshCw, 
  CheckCircle2, ShieldAlert, Terminal, BookOpen, Calendar, 
  Trash2,
  Bot,
  Plus,
  KeyRound,
  ExternalLink,
  UserCheck,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateTokenClient } from "@/lib/token"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"

// Імітація початкових даних (можна винести в пропси)
const initialApiData = {
  description: "Цей API-токен призначений для синхронізації сутностей CRM (ліди, об'єкти нерухомості) із зовнішніми лендінгами, Telegram-ботами або іншими внутрішніми сервісами компанії.",
  created_at: "2026-06-01T10:00:00.000Z",
  expires_at: "2027-06-01T10:00:00.000Z",
  token: "lx_live_51NfGzkK9zP8vY2m1R0wQ9Bx8Lz7K2p0sX5vB4nM9qW",
  capabilities: [
    "Створення нових лідів (POST /api/v1/leads)",
    "Читання та фільтрація списку об'єктів (GET /api/v1/properties)",
    "Оновлення статусів та етапів воронок",
    "Прикріплення об'єктів нерухомості до існуючих покупців"
  ],
  limitations: [
    "Rate Limit: максимум 60 запитів на хвилину (RPM) з однієї IP-адреси",
    "Максимальний розмір JSON-payload: 2MB на один запит",
    "Заборонено видалення (DELETE) системних сутностей через цей токен"
  ]
}

interface BotData {
    id: string
    username: string
  }

  interface BotSlots {
    admin: BotData | null
    user: BotData | null
  }

export default function ApiIntegrationView() {
  const session = useSession()
  const user = session?.data?.user
  const [token, setToken] = useState("")
  const [showToken, setShowToken] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"curl" | "fetch">("curl")
  const [bots, setBots] = useState<BotSlots>({
    admin: null,
    user: null
  })

  // Генеруємо токен тільки тоді, коли прийшли дані користувача
  const generateToken = async () => {
    setToken(await generateTokenClient('1h'))
  }
    useEffect(() => {
        generateToken()
    }, [user])

  // Функція копіювання токена
  const handleCopy = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Імітація ручного оновлення токена (Регенерація)
  const handleRefresh = () => {
    generateToken()
  }

  // Функція обробки ТГ токену
  const handleSaveBot = async (e: React.FormEvent<HTMLFormElement>, botType: "admin" | "user") => {
    e.preventDefault()
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const botToken = formData.get("bot_token") as string
  
    if (!botToken.trim()) return
  
    try {
      const response = await fetch("/api/tg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Передаємо і токен, і тип (якщо твій /api/tg очікує тип, щоб знати куди писати в БД)
        body: JSON.stringify({ token: botToken, type: botType }), 
      })
  
      const result = await response.json()
      
      if (result.success && result.bot) {
        // Оновлюємо стейт по динамічному ключу botType, який прийшов з аргументів
        setBots((prev) => ({
          ...prev,
          [botType]: { 
            id: result.bot.id, 
            username: result.bot.username 
          }
        }))
        
        form.reset() // Очищаємо поле після успішного збереження
      } else {
        alert(result.error || "Помилка валідації")
      }
    } catch (error) {
      console.error("Помилка відправки:", error)
    }
  }
  
  // видалення ТГ бота
  const handleDelete = (type: "admin" | "user") => {
    setBots((prev) => ({ ...prev, [type]: null }))
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">

<div className="space-y-6 p-6 bg-card border rounded-xl">
      {/* Заголовок */}
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">Інтеграція Telegram Ботів</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Підключіть максимум 2 боти: один для сповіщень адмінів, інший — для взаємодії з користувачами.
          </p>
        </div>
        <a 
          href="https://t.me/BotFather" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          @BotFather <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Форма додавання / зміни бота */}
      Ось оновлена форма. select повністю прибрано, натомість тепер є два окремі поля з унікальними name (admin_token та user_token), розташовані одне під одним.

Оновлений JSX форми:
TypeScript
{/* Рядок 1: Адмін панель */}
<form 
          onSubmit={(e) => handleSaveBot(e, "admin")} 
          className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-fit shrink-0 uppercase">
            Для адмін панелі
          </span>
          
          <div className="relative flex-1">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="bot_token"
              type="password"
              placeholder="Токен від @BotFather для адмінки"
              className="pl-9 font-mono text-sm h-10"
              autoComplete="off"
              required
            />
          </div>
          
          <Button type="submit" size="default" className="gap-2 shrink-0 sm:w-auto w-full">
            <Plus className="h-4 w-4" />
            Зберегти
          </Button>
        </form>

        {/* Рядок 2: Для користувачів */}
        <form 
          onSubmit={(e) => handleSaveBot(e, "user")} 
          className="flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:w-[160px] shrink-0 uppercase">
            Для користувачів
          </span>
          
          <div className="relative flex-1">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-fit text-muted-foreground" />
            <Input
              name="bot_token"
              type="password"
              placeholder="Токен від @BotFather для клієнтів"
              className="pl-9 font-mono text-sm h-10"
              autoComplete="off"
              required
            />
          </div>
          
          <Button type="submit" size="default" className="gap-2 shrink-0 sm:w-auto w-full">
            <Plus className="h-4 w-4" />
            Зберегти
          </Button>
        </form>

      {/* Статус слотів */}
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
          Поточні інтеграції
        </label>
        
        <div className="grid gap-3 md:grid-cols-2">
          
          {/* Слот 1: Адмін панель */}
          <div className={`border rounded-lg p-3 flex items-center justify-between gap-4 ${bots.admin ? 'bg-zinc-50/50 dark:bg-zinc-900/30' : 'border-dashed bg-transparent'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-lg shrink-0 ${bots.admin ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Адмін панель</p>
                <p className="text-sm font-semibold truncate mt-0.5">
                  {bots.admin ? `@${bots.admin.username}` : "Не підключено"}
                </p>
              </div>
            </div>
            {bots.admin && (
              <Button 
                variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => handleDelete("admin")} type="button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Слот 2: Користувачі */}
          <div className={`border rounded-lg p-3 flex items-center justify-between gap-4 ${bots.user ? 'bg-zinc-50/50 dark:bg-zinc-900/30' : 'border-dashed bg-transparent'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-lg shrink-0 ${bots.user ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}`}>
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Для користувачів</p>
                <p className="text-sm font-semibold truncate mt-0.5">
                  {bots.user ? `@${bots.user.username}` : "Не підключено"}
                </p>
              </div>
            </div>
            {bots.user && (
              <Button 
                variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => handleDelete("user")} type="button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
      
      {/* Хедер та Загальний опис */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" /> Інтеграція по API
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          {initialApiData.description}
        </p>
      </div>

      {/* Метадані (Дати створення/смерті) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-xs">
            <span className="text-muted-foreground block">Дата створення</span>
            <span className="font-medium">{new Date(initialApiData.created_at).toLocaleDateString("uk-UA", { dateStyle: "long" })}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border">
          <Calendar className="h-4 w-4 text-destructive" />
          <div className="text-xs">
            <span className="text-muted-foreground block">Термін дії (Дата смерті)</span>
            <span className="font-medium text-destructive">
              {new Date(initialApiData.expires_at).toLocaleDateString("uk-UA", { dateStyle: "long" })}
            </span>
          </div>
        </div>
      </div>

      {/* Керування Токеном */}
      <Card className="border-primary/20 bg-primary/[0.01]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" /> Ключ доступу (API Token)
          </CardTitle>
          <CardDescription>
            Передавайте цей токен у заголовку `Authorization: Bearer {`<token>`}` для кожного запиту.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 font-mono text-sm bg-background border rounded-md px-3 py-2 flex items-center min-h-[40px] tracking-tight overflow-x-auto whitespace-nowrap">
            {!token 
  ? "Завантаження..." 
  : showToken 
    ? token 
    : "•".repeat(Math.max(0, token.length - 10)) + token.slice(-10)
}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setShowToken(!showToken)} title={showToken ? "Приховати" : "Показати"}>
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="icon" onClick={handleCopy} className="relative">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              
              <Button variant="destructive" className="gap-2 w-full sm:w-auto" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Оновити вручну
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Можливості та Обмеження */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Можливості */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Дозволені операції (Можливості)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {initialApiData.capabilities.map((item, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Обмеження */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4" /> Обмеження токена (Constraints)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {initialApiData.limitations.map((item, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 text-muted-foreground">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Інструкція та Приклади коду */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" /> Інструкція з підключення та приклади
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Крок 1:</strong> Налаштуйте ваш HTTP-клієнт на роботу з базовим доменом системи.</p>
            <p><strong>Крок 2:</strong> Додайте заголовок авторизації.</p>
            <p><strong>Крок 3:</strong> Направляйте POST-запит на створення сутності з валідною структурою тіла запиту.</p>
          </div>

          {/* Таби вибору коду */}
          <div className="space-y-2">
            <div className="flex border-b text-sm">
              <button 
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "curl" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
                onClick={() => setActiveTab("curl")}
              >
                cURL
              </button>
              <button 
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "fetch" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
                onClick={() => setActiveTab("fetch")}
              >
                JavaScript (Fetch)
              </button>
            </div>

            {/* Контент табів */}
            <div className="bg-zinc-950 text-zinc-100 rounded-lg p-4 font-mono text-xs overflow-x-auto relative group">
              {activeTab === "curl" ? (
                <pre>{`curl -X POST https://lynxai-crm.com/api/v1/leads \\
  -H "Authorization: Bearer ${showToken ? token : "YOUR_API_TOKEN"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Нова заявка з сайту",
    "first_name": "Іван",
    "last_name": "Тестовий",
    "phone": "+380970000000",
    "lead_type": "buyer"
  }'`}</pre>
              ) : (
                <pre>{`const createLead = async () => {
  const response = await fetch('https://lynxai-crm.com/api/v1/leads', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${showToken ? token : "YOUR_API_TOKEN"}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: "Нова заявка з сайту",
      first_name: "Іван",
      last_name: "Тестовий",
      phone: "+380970000000",
      lead_type: "buyer"
    })
  });
  
  const result = await response.json();
  console.log(result);
};`}</pre>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}