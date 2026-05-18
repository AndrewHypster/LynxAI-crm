import { Lead, LEAD_ROLE_CONFIG, LEAD_STATUS_CONFIG } from "@/lib/constants"
import { ColumnConfig } from "../table"
import Link from "next/link"

export const leadColumns: ColumnConfig<Lead>[] = [
  {
    header: "Ім'я",
    key: "full_name",
    type: "text",
    render: (lead) => (
      <Link href={`/leads/${lead.id}`}>
        <span className="font-bold">{lead.full_name || "Не вказано"}</span>
      </Link>
    ),
  },
  {
    header: "Телефон",
    key: "phone",
    type: "custom",
    render: (lead) => <p> {lead.phone}</p>,
  },
  {
    header: "Статус",
    key: "status",
    type: "badge-dot",
    config: LEAD_STATUS_CONFIG,
  },
  {
    header: "Роль",
    key: "role",
    type: "badge-icon",
    config: LEAD_ROLE_CONFIG,
  },
  {
    header: "Бюджет",
    key: "budget",
    type: "custom",
    render: (lead) => {
      if (!lead.budget) return <span className="text-gray-400">—</span>
      return (
        <span className="font-medium text-green-600 dark:text-green-400">
          {lead.budget}
        </span>
      )
    },
  },
  {
    header: "Готовність",
    key: "readiness_for_selection",
    type: "custom",
    render: (lead) => {
      const isReady =
        lead.readiness_for_selection === "ready" ||
        lead.readiness_for_selection === "high"
      return (
        <span
          className={`rounded border px-2 py-1 text-xs ${
            isReady
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-gray-200 bg-gray-50 text-gray-600"
          }`}
        >
          {lead.readiness_for_selection || "В обробці"}
        </span>
      )
    },
  },
  {
    header: "Дата створення",
    key: "created_at",
    type: "custom",
    render: (lead) => {
      const date = new Date(lead.created_at)
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
    header: "Менеджер ID",
    key: "manager_id",
    type: "custom",
    render: (lead) => (
      <span className="font-mono text-sm text-gray-600">
        {lead.manager_id === 0 || !lead.manager_id ? (
          <span className="text-red-400">Невказано</span>
        ) : (
          `#${lead.manager_id}`
        )}
      </span>
    ),
  },
  {
    header: "Причина інтересу",
    key: "interest_reason",
    type: "custom",
    render: (lead) => (
      <p
        className="max-w-[200px] truncate text-sm text-gray-600"
        title={lead.interest_reason || ""}
      >
        {lead.interest_reason || (
          <span className="text-gray-400 italic">не вказано</span>
        )}
      </p>
    ),
  },

  // {
  //   header: "Телеграм",
  //   key: "telegram",
  //   type: "custom",
  //   render: (lead) => (
  //     <Link
  //       className="flex h-auto items-center p-0 font-normal text-blue-500"
  //       target="_blank"
  //       href={`https://t.me/${lead.telegram}`}
  //     >
  //       <Send className="mr-1 h-3 w-3" /> @{lead.telegram}
  //     </Link>
  //   ),
  // },
]
