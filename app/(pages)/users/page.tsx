"use client"

import { useRouter } from "next/navigation"
import {
  User,
  USER_ROLE_CONFIG,
  USER_ROLES,
  USER_STATUS_CONFIG,
} from "@/lib/constants"
import { ColumnConfig, UniversalTable } from "@/components/table"
import Link from "next/link"
import { Mail } from "lucide-react"
import { useState } from "react"

// 1. Конфіг колонок виносимо за межі компонента, щоб він не перестворювався при кожному рендері
export const userColumns: ColumnConfig<User>[] = [
  {
    header: "Ім'я",
    key: "firstName",
    type: "text",
    render: (lead) => (
      <span className="font-bold">
        {lead.firstName} {lead.lastName}
      </span>
    ),
  },

  {
    header: "Роль",
    key: "role",
    type: "badge-icon",
    config: USER_ROLE_CONFIG,
  },
  {
    header: "Статус",
    key: "status",
    type: "badge-dot",
    config: USER_STATUS_CONFIG,
  },
  {
    header: "Телеграм",
    key: "telegram",
    type: "custom",
    render: (user) => (
      <Link
        className="flex h-auto items-center p-0 font-normal text-blue-500"
        target="_blank"
        href={`https://t.me/${user.email}`}
      >
        <Mail className="mr-1 h-3 w-3" />
        {user.email}
      </Link>
    ),
  },
  {
    header: "Створений",
    key: "createdAt",
    type: "custom",
    render: (user) => <p> {user.createdAt}</p>,
  },
]

export default function UsersTable() {
  const router = useRouter()

  const MOCK_USERS: User[] = [
    {
      id: "u1",
      firstName: "Олександр",
      lastName: "Коваленко",
      email: "olex.kov@lynx.ai",
      role: USER_ROLES.CREATOR,
      status: "ACTIVE",
      createdAt: "2026-01-10",
    },
    {
      id: "u2",
      firstName: "Марія",
      lastName: "Петренко",
      email: "m.petrenko@lynx.ai",
      role: USER_ROLES.ADMIN,
      status: "ACTIVE",
      createdAt: "2026-01-15",
    },
    {
      id: "u3",
      firstName: "Дмитро",
      lastName: "Савченко",
      email: "d.sav@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-02-01",
    },
    {
      id: "u4",
      firstName: "Олена",
      lastName: "Лисенко",
      email: "o.lysenko@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "PENDING",
      createdAt: "2026-02-05",
    },
    {
      id: "u5",
      firstName: "Артем",
      lastName: "Бондар",
      email: "a.bondar@lynx.ai",
      role: USER_ROLES.ADMIN,
      status: "ACTIVE",
      createdAt: "2026-02-10",
    },
    {
      id: "u6",
      firstName: "Ірина",
      lastName: "Мороз",
      email: "i.moroz@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "INACTIVE",
      createdAt: "2026-02-12",
    },
    {
      id: "u7",
      firstName: "Максим",
      lastName: "Ткаченко",
      email: "m.tkach@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-02-14",
    },
    {
      id: "u8",
      firstName: "Світлана",
      lastName: "Кравченко",
      email: "s.krav@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-02-15",
    },
    {
      id: "u9",
      firstName: "Андрій",
      lastName: "Шевченко",
      email: "a.sheva@lynx.ai",
      role: USER_ROLES.ADMIN,
      status: "ACTIVE",
      createdAt: "2026-02-18",
    },
    {
      id: "u10",
      firstName: "Юлія",
      lastName: "Козак",
      email: "y.kozak@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "PENDING",
      createdAt: "2026-02-20",
    },
    {
      id: "u11",
      firstName: "Сергій",
      lastName: "Павленко",
      email: "s.pavl@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-02-22",
    },
    {
      id: "u12",
      firstName: "Наталія",
      lastName: "Мельник",
      email: "n.melnik@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-02-25",
    },
    {
      id: "u13",
      firstName: "Віталій",
      lastName: "Клименко",
      email: "v.klym@lynx.ai",
      role: USER_ROLES.ADMIN,
      status: "INACTIVE",
      createdAt: "2026-03-01",
    },
    {
      id: "u14",
      firstName: "Тетяна",
      lastName: "Олійник",
      email: "t.oliyn@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-03-03",
    },
    {
      id: "u15",
      firstName: "Денис",
      lastName: "Поліщук",
      email: "d.pol@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-03-05",
    },
    {
      id: "u16",
      firstName: "Анна",
      lastName: "Руденко",
      email: "a.rud@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "PENDING",
      createdAt: "2026-03-07",
    },
    {
      id: "u17",
      firstName: "Роман",
      lastName: "Зайцев",
      email: "r.zaitsev@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-03-10",
    },
    {
      id: "u18",
      firstName: "Оксана",
      lastName: "Білоус",
      email: "o.bilous@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-03-12",
    },
    {
      id: "u19",
      firstName: "Ігор",
      lastName: "Вовк",
      email: "i.vovk@lynx.ai",
      role: USER_ROLES.ADMIN,
      status: "ACTIVE",
      createdAt: "2026-03-15",
    },
    {
      id: "u20",
      firstName: "Марина",
      lastName: "Тищенко",
      email: "m.tysh@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "INACTIVE",
      createdAt: "2026-03-18",
    },
    {
      id: "u21",
      firstName: "Павло",
      lastName: "Кушнір",
      email: "p.kush@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-03-20",
    },
    {
      id: "u22",
      firstName: "Вікторія",
      lastName: "Чорна",
      email: "v.chorna@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-03-22",
    },
    {
      id: "u23",
      firstName: "Євген",
      lastName: "Марченко",
      email: "e.march@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "PENDING",
      createdAt: "2026-03-25",
    },
    {
      id: "u24",
      firstName: "Лариса",
      lastName: "Гриценко",
      email: "l.gryts@lynx.ai",
      role: USER_ROLES.MANAGER,
      status: "ACTIVE",
      createdAt: "2026-03-28",
    },
    {
      id: "u25",
      firstName: "Микола",
      lastName: "Дорошенко",
      email: "m.dorosh@lynx.ai",
      role: USER_ROLES.ADMIN,
      status: "ACTIVE",
      createdAt: "2026-03-30",
    },
  ]
  const [data, setData] = useState(MOCK_USERS)

  return (
    <div className="rounded-md border bg-card">
      <UniversalTable
        data={data as []}
        columns={userColumns}
        onChange={({ id, key, value }) =>
          setData((prev) =>
            prev.map(
              (item) =>
                item.id === id
                  ? { ...item, [key]: value } // Створюємо новий об'єкт (копію)
                  : item // Залишаємо старе посилання для незмінених елементів
            )
          )
        }
      />
    </div>
  )
}
