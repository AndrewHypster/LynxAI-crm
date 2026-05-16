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
  buyer: "buyer",
  seller: "seller",
  partner: "partner",
} as const
export type LeadRole = keyof typeof LEAD_ROLES

export const LEAD_STATUSES = {
  new: "new",
  active: "active",
  deal: "deal",
  lost: "lost",
} as const
export type LeadStatuses = keyof typeof LEAD_STATUSES

export interface Lead {
  id: number
  full_name: string | null
  phone: string | null
  status: LeadStatuses | string
  role: LeadRole | string
  budget: string | null
  readiness_for_selection: string | null
  created_at: string // Date
  manager_id: number | null
  interest_reason: string | null
  role_label: string  // read only
  status_label: string  // read only
}

export const LEAD_ROLE_CONFIG = {
  [LEAD_ROLES.buyer]: {
    label: "Покупець",
    icon: User,
    dot: "bg-emerald-500",
    css: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  [LEAD_ROLES.seller]: {
    label: "Продавець",
    icon: Building2,
    dot: "bg-cyan-500",
    css: "text-cyan-700 bg-cyan-50 border-cyan-200",
  },
  [LEAD_ROLES.partner]: {
    label: "Партнер",
    icon: HelpCircle,
    dot: "bg-slate-400",
    css: "text-slate-600 bg-slate-50 border-slate-200",
  },
} as const

export const LEAD_STATUS_CONFIG = {
  [LEAD_STATUSES.new]: {
    label: "НОВИЙ",
    dot: "bg-blue-500",
    css: "bg-blue-50 text-blue-600 border-blue-200",
  },
  [LEAD_STATUSES.active]: {
    label: "АКТИВНИЙ",
    dot: "bg-emerald-500",
    css: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  [LEAD_STATUSES.deal]: {
    label: "ЗАВЕРШЕНО",
    dot: "bg-orange-500",
    css: "bg-orange-50 text-orange-700 border-orange-200",
  },
  [LEAD_STATUSES.lost]: {
    label: "ЗАБЛОКОВАНО",
    dot: "bg-red-500",
    css: "bg-red-50 text-red-600 border-red-200",
  },
} as const

export interface LeadDetails extends Lead {
  telegram_id: number | null
  username: string | null
  phone_normalized: string | null
  phone_location: string | null
  is_ukraine: boolean | null
  messengers: string | null
  preferred_comm: string | null
  stage: string | null
  result: string | null
  contact_status: string | null
  priority: string | null
  action_priority: string | null
  timeline: string | null
  warmth: number | null
  district: string | null
  rooms: string | null
  floor: string | null
  wishes: string | null
  family_members: string | null
  property_type: string | null
  area: string | null
  floor_info: string | null
  repair: string | null
  property_name: string | null
  budget_min: string | null
  budget_max: string | null
  expected_price: string | null
  income: string | null
  down_payment: string | null
  monthly_payment: string | null
  calculated_payment: string | null
  family_income: string | null
  deal_value: string | null
  surcharge: string | null
  finance_format: string | null
  purpose: string | null
  format: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  click_id: string | null
  user_id: number
  shift_id: number | null
  updated_at: string // Date
  assigned_at: string | null
  taken_in_work_at: string | null
  first_reaction_at:  string | null
  last_client_activity:  string | null
  last_followup_at:  string | null
  snooze_until:  string | null
  next_step_date:  string | null
  expected_closing_date:  string | null
  deleted_at:  string | null
  closure_date:  string | null
  first_response_time: number | null
  reassigned_count: number | null
  contact_attempts: number | null
  contact_source: string | null
  night_lead: boolean | null
  repeat_clientExpand: boolean | null
repeat_countExpand: number | null
first_contactExpand: boolean | null
speed_to_leadExpand: number | null
sla_breachExpand: boolean | null
variants_foundExpand: number | null
variants_sentExpand: boolean | null
is_testExpand: boolean | null
scenarioExpand: string | null
scenario_idExpand: string | null
scenario_typeExpand: string | null
stage_719Expand: string | null
readiness_for_selectionExpand: string | null
main_requestExpand: string | null
funnel_nameExpand: string | null
is_for_clientExpand: boolean | null
benefit_categoryExpand: string | null
accessibilityExpand: string | null
social_statusExpand: string | null
social_has_housingExpand: string | null
social_received_compExpand: string | null
social_on_queueExpand: string | null
social_recommendationExpand: string | null
has_propertyExpand: boolean | null
total_area_existingExpand: string | null
existing_areaExpand: string | null
selling_currentExpand: boolean | null
building_statusExpand: string | null
ownership_typeExpand: string | null
partnership_typeExpand: string | null
agency_nameExpand: string | null
partner_flagExpand: boolean | null
partner_sourceExpand: string | null
partner_formatExpand: string | null
partner_client_infoExpand: string | null
partner_rewardExpand: string | null
partner_statusExpand: string | null
val_addressExpand: string | null
val_reasonExpand: string | null
valuation_typeExpand: string | null
valuation_repairExpand: string | null
valuation_furnitureExpand: string | null
seller_buy_roomsExpand: string | null
seller_buy_districtExpand: string | null
seller_buy_budgetExpand: string | null
seller_buy_surchargeExpand: string | null
seller_buy_typeExpand: string | null
eoselia_readyExpand: string | null
eoselia_detailsExpand: any | null
post_sale_planExpand: string | null
documents_readyExpand: boolean | null
counter_purchaseExpand: boolean | null
commentExpand: string | null
status_notesExpand: string | null
feedbackExpand: string | null
loss_reasonExpand: string | null
reason_urgentExpand: string | null
reason_refusalExpand: string | null
post_survey_commentExpand: string | null
raw_dataExpand: any | null
notion_page_idExpand: string | null
notion_urlExpand: string | null
notion_sync_statusExpand: string | null
notion_synced_atExpand: string | null
lead_status_notionExpand: string | null
ai_scoreExpand: number | null
ai_summaryExpand: string | null
survey_statusExpand: string | null
survey_progressExpand: string | null
qualification_statusExpand: string | null
client_timezoneExpand: string | null
last_stepExpand: string | null
followup_levelExpand: number | null
is_reminder_sentExpand: boolean | null
selection_modeExpand: string | null
showing_countExpand: number | null
matched_objects_idsExpand: string[]
liked_objects_idsExpand: string[]
view_requested_idsExpand: string[]
questions_idsExpand: string[]
reaction_actionsExpand: any | null
selected_object_idExpand: string | null
primary_actionExpand: string | null
obj1_idExpand: string | null
obj2_idExpand: string | null
obj3_idExpand: string | null
reaction_clientExpand: string | null
wants_viewing_idExpand: string | null
interest_reasonExpand: string | null
survey_status_label: string // read only
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