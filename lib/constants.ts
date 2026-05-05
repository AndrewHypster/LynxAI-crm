import {
  ShieldCheck,
  UserCog,
  Contact,
  User,
  Building2,
  HelpCircle,
} from "lucide-react"

// ==========================================
// 1. SYSTEM ROLES (Для користувачів системи)
// ==========================================
export const USER_ROLES = {
  CREATOR: "CREATOR",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
} as const

export type UserRole = keyof typeof USER_ROLES

export const USER_ROLE_CONFIG = {
  [USER_ROLES.CREATOR]: {
    label: "Засновник",
    icon: ShieldCheck,
    color: "text-red-600 bg-red-50 border-red-200",
  },
  [USER_ROLES.ADMIN]: {
    label: "Адмін",
    icon: UserCog,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  [USER_ROLES.MANAGER]: {
    label: "Менеджер",
    icon: Contact,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
}

// ==========================================
// 2. LEAD ROLES (Для клієнтів/лідів у базі)
// ==========================================
export const LEAD_ROLES = {
  BUYER: "BUYER",
  REALTOR: "REALTOR",
  UNDEFINED: "UNDEFINED",
} as const
export type LeadRole = keyof typeof LEAD_ROLES

export const LEAD_STATUSES = {
  NEW: "NEW",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  BANNED: "BANNED",
} as const
export type LeadStatuses = keyof typeof LEAD_STATUSES

export interface Lead {
  id: string
  firstName: string
  lastName?: string | null
  telegram: string
  phone?: string | null
  role: LeadRole
  status: LeadStatuses
}

export const LEAD_ROLE_CONFIG = {
  [LEAD_ROLES.BUYER]: {
    label: "Покупець",
    icon: User,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [LEAD_ROLES.REALTOR]: {
    label: "Ріелтор",
    icon: Building2,
    dot: "bg-cyan-500",
    css: "text-cyan-700 bg-cyan-50 border-cyan-200",
  },
  [LEAD_ROLES.UNDEFINED]: {
    label: "Невизначено",
    icon: HelpCircle,
    dot: "bg-slate-400",
    css: "text-slate-600 bg-slate-50 border-slate-200",
  },
} as const

export const LEAD_STATUS_CONFIG = {
  [LEAD_STATUSES.NEW]: {
    label: "НОВИЙ",
    dot: "bg-blue-500",
    css: "bg-blue-50 text-blue-600 border-blue-200",
  },
  [LEAD_STATUSES.ACTIVE]: {
    label: "АКТИВНИЙ",
    dot: "bg-emerald-500",
    css: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  [LEAD_STATUSES.COMPLETED]: {
    label: "ЗАВЕРШЕНО",
    dot: "bg-orange-500",
    css: "bg-orange-50 text-orange-700 border-orange-200",
  },
  [LEAD_STATUSES.BANNED]: {
    label: "ЗАБЛОКОВАНО",
    dot: "bg-red-500",
    css: "bg-red-50 text-red-600 border-red-200",
  },
} as const

export interface LeadDetails extends Lead {
  budget: number
  intent: "RENT" | "BUY"
  location: string
  rooms: number
  hasBenefits: boolean
  amenities: string[] // ['Паркінг', 'Балкон']
  aiSummary: string // Текст від ШІ
}