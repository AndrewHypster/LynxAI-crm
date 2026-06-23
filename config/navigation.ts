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
} from "lucide-react"

export const NAV_CONFIG = [
  {
    title: "Огляд",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["CREATOR", "ADMIN", "MANAGER"],
      },
      {
        title: "Статистика",
        url: "/admin/stats",
        icon: PieChart,
        roles: ["CREATOR", "ADMIN"],
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
        roles: ["CREATOR"],
      },
      {
        title: "Штат",
        url: "/staff",
        icon: Users,
        roles: ["ADMIN", "CREATOR"],
      },
      {
        title: "+ користувача",
        url: "/staff/create",
        icon: Users,
        roles: ["ADMIN", "CREATOR"],
      },
      {
        title: "Ліди",
        url: "/leads",
        icon: BarChart3,
        roles: ["MANAGER", "ADMIN"],
      },
      {
        title: "+ ліда",
        url: "/leads/create",
        icon: BarChart3,
        roles: ["CREATOR", "ADMIN"],
      },
      {
        title: "Об'єкти",
        url: "/properties",
        icon: Home,
        roles: ["MANAGER", "ADMIN"],
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
        roles: ["ADMIN", "CREATOR"],
      },
      {
        title: "Ролі та права",
        url: "/roles",
        icon: ShieldCheck,
        roles: ["MANAGER", "ADMIN", "CREATOR"],
      },
      {
        title: "Статуси",
        url: "/statuses",
        icon: LucideLayers,
        roles: ["MANAGER", "ADMIN", "CREATOR"],
      },
    ],
  },
]
