import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  BarChart3,
  PieChart,
  ShieldCheck,
  LucideLayers,
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
        title: "Всі Компанії",
        url: "/creator/companies",
        icon: Briefcase,
        roles: ["CREATOR"],
      },
      {
        title: "Команда",
        url: "/admin/team",
        icon: Users,
        roles: ["ADMIN", "CREATOR"],
      },
      {
        title: "Ліди",
        url: "/leads",
        icon: BarChart3,
        roles: ["MANAGER", "ADMIN"],
      },
    ],
  },
  {
    title: "Інформація",
    items: [
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
