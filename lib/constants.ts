import {
  ShieldCheck,
  UserCog,
  Contact,
  User,
  Building2,
  HelpCircle,
  House,
  Building,
  LandPlot,
  Factory,
  CircleCheck,
  Key,
  Ban,
  Clock,
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
    css: "text-red-600 bg-red-50 border-red-200",
  },
  [USER_ROLES.ADMIN]: {
    label: "Адмін",
    icon: UserCog,
    css: "text-purple-600 bg-purple-50 border-purple-200",
  },
  [USER_ROLES.MANAGER]: {
    label: "Менеджер",
    icon: Contact,
    css: "text-blue-600 bg-blue-50 border-blue-200",
  },
} as const

export const USER_STATUS_CONFIG = {
  ACTIVE: {
    label: "Активний",
    css: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  INACTIVE: {
    label: "Неактивний",
    css: "bg-slate-100 text-slate-600 border-slate-200",
  },
  PENDING: {
    label: "Очікування",
    css: "bg-amber-100 text-amber-700 border-amber-200",
  },
} as const

export type UserStatus = keyof typeof USER_STATUS_CONFIG

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
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

// =======================
// 3. PROPERTY (власність)
// =======================
export const PROPERTY_TYPES = {
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
  LAND: "LAND",
  COMMERCIAL: "COMMERCIAL",
} as const

export const PROPERTY_TYPE_CONFIG = {
  [PROPERTY_TYPES.HOUSE]: {
    label: "Житло",
    icon: House,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [PROPERTY_TYPES.APARTMENT]: {
    label: "Квартира",
    icon: Building,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [PROPERTY_TYPES.LAND]: {
    label: "Ділянка",
    icon: LandPlot,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [PROPERTY_TYPES.COMMERCIAL]: {
    label: "Комрція",
    icon: Factory,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
}

export type PropertyTypes = keyof typeof PROPERTY_TYPES

export const PROPERTY_STATUSES = {
  AVAILABLE: "AVAILABLE",
  RENTED: "RENTED",
  SOLD: "SOLD",
  RESERVED: "RESERVED",
} as const

export const PROPERTY_STATUS_CONFIG = {
  [PROPERTY_STATUSES.AVAILABLE]: {
    label: "Доступне",
    icon: CircleCheck,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [PROPERTY_STATUSES.RENTED]: {
    label: "Орендовано",
    icon: Key,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [PROPERTY_STATUSES.SOLD]: {
    label: "Продано",
    icon: Ban,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [PROPERTY_STATUSES.RESERVED]: {
    label: "Резервоване",
    icon: Clock,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
}

export type PropertyStatuses = keyof typeof PROPERTY_STATUSES

export type Benefit =
  | "PARKING"
  | "ELEVATOR"
  | "BALCONY"
  | "POOL"
  | "SECURITY"
  | "WIFI"
  | "FURNISHED"
  | "PETS_ALLOWED"
  | "AIR_CONDITIONING"
  | "GARDEN"

export interface BaseProperty {
  id: string // id нерухомості
  ownerId: string // id власника (агенства / реєлтора)
  title: string // заголовок
  address: string // адрес
  location?: string // координати
  type: PropertyTypes // хата | квартира | земля | комерція
  status: PropertyStatuses // доступне | орендовано | продано | заброньовано
  salePrice?: number | null // Ціна повного викупу
  rentPrice?: number | null // Ціна оренди за місяць
  currency: "USD" | "EUR" | "UAH" // Валюта
  isForSale: boolean // для продажу
  isForRent: boolean // для оренди
  area: number // Площа в м²
  rooms?: number // кільк кімнат
  floor?: number // поверх
  images: string[] // Масив посилань на фото
  description?: string // опис
  benefits?: Benefit[] // список особливостей
  documents?: string // силка на документ
  createdAt: string // дата створення
}

export interface HouseProperty extends BaseProperty {}
export interface ApartmentProperty extends BaseProperty {}
export interface LandProperty extends BaseProperty {}
export interface CommercialProperty extends BaseProperty {}