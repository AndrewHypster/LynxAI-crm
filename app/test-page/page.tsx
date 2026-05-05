"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lead, LEAD_ROLE_CONFIG, LEAD_STATUS_CONFIG } from "@/lib/constants"
import { ColumnConfig, UniversalTable } from "@/components/table"
import Link from "next/link"
import { Send, Trash2 } from "lucide-react"

// 1. Конфіг колонок виносимо за межі компонента, щоб він не перестворювався при кожному рендері
export const leadColumns: ColumnConfig<Lead>[] = [
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
    config: LEAD_ROLE_CONFIG,
    // render: (lead) => {
    //   const config = LEAD_ROLE_CONFIG[lead.role]
    //   const RoleIcon = config.icon
    //   return (
    //     <button className="group flex cursor-pointer items-center gap-1.5 transition-transform active:scale-95">
    //       <Badge
    //         variant="outline"
    //         className={`${config.css} border-current/20`}
    //       >
    //         <RoleIcon className="mr-1 size-3" />
    //         {config.label}
    //       </Badge>
    //     </button>
    //   )
    // },
  },
  {
    header: "Статус",
    key: "status",
    type: "text",
    render: (lead) => {
      const config = LEAD_STATUS_CONFIG[lead.status]
      return (
        <button className={`flex items-center gap-2 ... ${config?.css}`}>
          {config?.label}
        </button>
      )
    },
  },
  {
    header: "Телеграм",
    key: "telegram",
    type: "custom",
    render: (lead) => (
      <Link
        className="flex h-auto items-center p-0 font-normal text-blue-500"
        target="_blank"
        href={`https://t.me/${lead.telegram}`}
      >
        <Send className="mr-1 h-3 w-3" /> @{lead.telegram}
      </Link>
    ),
  },
  {
    header: "Телефон",
    key: "phone",
    type: "custom",
    render: (lead) => <p> {lead.phone}</p>,
  },
]

export default function LeadsTable(/*{ leads }: LeadsTableProps*/) {
  const router = useRouter()

  const leads = [
    {
      id: "1",
      firstName: "Богдан",
      lastName: "Адмін",
      role: "UNDEFINED",
      status: "ACTIVE",
      telegram: "bohdan_dev",
      phone: "+380971234567",
    },
    {
      id: "2",
      firstName: "Олена",
      lastName: "Коваль",
      role: "BUYER",
      status: "NEW",
      telegram: "olena_k",
      phone: "+380631112233",
    },
    {
      id: "3",
      firstName: "Дмитро",
      lastName: "Петренко",
      role: "REALTOR",
      status: "ACTIVE",
      telegram: "dima_ptr",
      phone: "+380504445566",
    },
    {
      id: "4",
      firstName: "Марія",
      lastName: "Шевченко",
      role: "BUYER",
      status: "BANNED",
      telegram: "mary_shev",
      phone: null,
    },
    {
      id: "5",
      firstName: "Артем",
      lastName: "Іванов",
      role: "BUYER",
      status: "COMPLETED",
      telegram: "art_ivan",
      phone: "+380677778899",
    },
    {
      id: "6",
      firstName: "Юлія",
      lastName: "Мельник",
      role: "REALTOR",
      status: "ACTIVE",
      telegram: "july_mel",
      phone: "+380931234500",
    },
    {
      id: "7",
      firstName: "Сергій",
      lastName: "Ткаченко",
      role: "BUYER",
      status: "NEW",
      telegram: "serg_tk",
      phone: "+380956667788",
    },
    {
      id: "8",
      firstName: "Анна",
      lastName: "Бондар",
      role: "BUYER",
      status: "ACTIVE",
      telegram: "ann_bond",
      phone: "+380682223344",
    },
    {
      id: "9",
      firstName: "Віталій",
      lastName: "Лисенко",
      role: "UNDEFINED",
      status: "ACTIVE",
      telegram: "vital_lys",
      phone: "+380993334455",
    },
    {
      id: "10",
      firstName: "Оксана",
      lastName: "Павленко",
      role: "BUYER",
      status: "COMPLETED",
      telegram: "ksana_p",
      phone: null,
    },
    {
      id: "11",
      firstName: "Іван",
      lastName: "Кравченко",
      role: "REALTOR",
      status: "ACTIVE",
      telegram: "ivan_krav",
      phone: "+380665554433",
    },
    {
      id: "12",
      firstName: "Ольга",
      lastName: "Савченко",
      role: "BUYER",
      status: "BANNED",
      telegram: "olga_sav",
      phone: "+380970001122",
    },
    {
      id: "13",
      firstName: "Максим",
      lastName: "Козак",
      role: "BUYER",
      status: "NEW",
      telegram: "max_kozak",
      phone: "+380638889900",
    },
    {
      id: "14",
      firstName: "Тетяна",
      lastName: "Мороз",
      role: "BUYER",
      status: "ACTIVE",
      telegram: "tany_moroz",
      phone: "+380501239876",
    },
    {
      id: "15",
      firstName: "Андрій",
      lastName: "Кузьменко",
      role: "REALTOR",
      status: "COMPLETED",
      telegram: "andrew_kuz",
      phone: "+380671110022",
    },
    {
      id: "16",
      firstName: "Світлана",
      lastName: "Зайцева",
      role: "BUYER",
      status: "NEW",
      telegram: "sveta_zay",
      phone: null,
    },
    {
      id: "17",
      firstName: "Руслан",
      lastName: "Гончар",
      role: "BUYER",
      status: "ACTIVE",
      telegram: "rus_gonchar",
      phone: "+380934445566",
    },
    {
      id: "18",
      firstName: "Наталія",
      lastName: "Клименко",
      role: "UNDEFINED",
      status: "ACTIVE",
      telegram: "nat_klym",
      phone: "+380957778811",
    },
    {
      id: "19",
      firstName: "Денис",
      lastName: "Олійник",
      role: "BUYER",
      status: "COMPLETED",
      telegram: "den_olyn",
      phone: "+380683332211",
    },
    {
      id: "20",
      firstName: "Вікторія",
      lastName: "Король",
      role: "BUYER",
      status: "ACTIVE",
      telegram: "vicky_k",
      phone: "+380991112233",
    },
    {
      id: "21",
      firstName: "Олександр",
      lastName: "Чумак",
      role: "REALTOR",
      status: "BANNED",
      telegram: "alex_chum",
      phone: "+380661234567",
    },
    {
      id: "22",
      firstName: "Валентина",
      lastName: "Білоус",
      role: "BUYER",
      status: "NEW",
      telegram: "valya_b",
      phone: null,
    },
    {
      id: "23",
      firstName: "Євген",
      lastName: "Колос",
      role: "BUYER",
      status: "ACTIVE",
      telegram: "evgen_kolos",
      phone: "+380975556677",
    },
    {
      id: "24",
      firstName: "Ірина",
      lastName: "Терещенко",
      role: "REALTOR",
      status: "ACTIVE",
      telegram: "ira_ter",
      phone: "+380632221100",
    },
    {
      id: "25",
      firstName: "Микола",
      lastName: "Дяченко",
      role: "BUYER",
      status: "COMPLETED",
      telegram: "nick_dya",
      phone: "+380509990011",
    },
  ]

  return (
    <div className="rounded-md border bg-card">
      <UniversalTable
        data={leads as Lead[]}
        columns={leadColumns}
      />
    </div>
  )
}
