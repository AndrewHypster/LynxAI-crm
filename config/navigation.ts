import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  BarChart3,
  PieChart,
  ShieldCheck,
  LucideLayers,
  Home,
  Webhook,
  ListChecks,
  Crown,
  Gem,
} from "lucide-react"

export const NAV_CONFIG = [
  {
    title: "Огляд",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["creator", "admin", "manager"],
      },
      {
        title: "Статистика",
        url: "/admin/stats",
        icon: PieChart,
        roles: ["creator", "admin"],
      },
    ],
  },
  {
    title: "Керування",
    items: [
      {
        title: "Всі Користувачі",
        url: "/users",
        icon: Briefcase,
        roles: ["creator"],
      },
      {
        title: "Штат",
        url: "/staff",
        icon: Users,
        roles: ["admin", "creator"],
      },
      {
        title: "+ користувача",
        url: "/staff/create",
        icon: Users,
        roles: ["admin", "creator"],
      },
      {
        title: "Ліди",
        url: "/leads",
        icon: BarChart3,
        roles: ["manager", "admin"],
      },
      {
        title: "+ ліда",
        url: "/leads/create",
        icon: BarChart3,
        roles: ["creator", "admin"],
      },
      {
        title: "Об'єкти",
        url: "/properties",
        icon: Home,
        roles: ["manager", "admin"],
      },
    ],
  },
  {
    title: "Інформація",
    items: [
      {
        title: "API",
        url: "/api",
        icon: Webhook,
        roles: ["admin", "creator"],
      },
      {
        title: "Підписки",
        url: "/subscriptions",
        icon: Gem,
        roles: ["admin", "creator"],
      },
      {
        title: "Ролі та права",
        url: "/roles",
        icon: ShieldCheck,
        roles: ["manager", "admin", "creator"],
      },
      {
        title: "Статуси",
        url: "/statuses",
        icon: LucideLayers,
        roles: ["manager", "admin", "creator"],
      },
    ],
  },
]
