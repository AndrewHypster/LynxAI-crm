import { User, USER_ROLE_CONFIG, USER_STATUS_CONFIG } from "@/lib/constants"
import { ColumnConfig } from "../table"
import Link from "next/link"
import { Send } from "lucide-react"

export const staffColumns: ColumnConfig<User>[] = [
  {
    header: "ID",
    key: "id",
    type: "custom",
    render: (user) => (
      <span className="font-mono text-sm text-gray-600">
        {user.id === 0 || !user.id ? (
          <span className="text-red-400">Невказано</span>
        ) : (
          `#${user.id}`
        )}
      </span>
    ),
  },
  {
    header: "Ім'я",
    key: "full_name",
    type: "text",
    render: (user) => (
      <Link href={`/staff/${user.id}`}>
        <span className="font-bold">{user.username || "Не вказано"}</span>
      </Link>
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
    key: "is_active",
    type: "custom",
    render: (user) => (
      <button type="button"
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-wider transition-all hover:opacity-80 active:scale-95 ${USER_STATUS_CONFIG[user.is_active ? "true" : "false"].css}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${USER_STATUS_CONFIG[user.is_active ? "true" : "false"].css}`} />
      {USER_STATUS_CONFIG[user.is_active ? "true" : "false"].label}
    </button>
    ),
  },

  {
    header: "Дата створення",
    key: "created_at",
    type: "custom",
    render: (user) => {
      const date = new Date(user.created_at)
      return (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          <div>{date.toLocaleDateString("uk-UA")}</div>
          <div className="text-xs text-gray-400">
            {date.toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )
    },
  },

  {
    header: "Телеграм",
    key: "username",
    type: "custom",
    render: (user) => (
      <Link
        className="flex h-auto items-center p-0 font-normal text-blue-500"
        target="_blank"
        href={`https://t.me/${user.username}`}
      >
        <Send className="mr-1 h-3 w-3" /> @{user.username}
      </Link>
    ),
  },
]
