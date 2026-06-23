"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageLoader } from "@/components/loading"
import {
  LEAD_ROLE_CONFIG,
  LEAD_STATUS_CONFIG,
  LEAD_STATUSES,
  LeadDetails,
} from "@/lib/constants"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface EditableFieldProps {
  isEditing: boolean // Чи активний глобальний режим редагування
  name: string // Унікальне ім'я поля в базі даних (напр. 'budget')
  value: any // Поточне значення (вже злите з чернетки)
  onChange: (name: string, value: any, type?: string) => void // Функція оновлення чернетки
  type?: "text" | "select" | "textarea" | "number" // Тип інпута
  options?: { value: string; label: string }[] // Варіанти для селекту
  inputClassName?: string // Можливість кастомізувати інпут зовні
  children: React.ReactNode // Твій оригінальний read-only дизайн поля
}

export const EditableField: React.FC<EditableFieldProps> = ({
  isEditing,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  inputClassName = "",
  children,
}) => {
  // Якщо режим редагування вимкнено — просто рендеримо твій готовий красивий UI
  if (!isEditing) {
    return <>{children}</>
  }

  // Спільні стилі для темної теми Slate
  const baseInputStyle = `border border-slate-800 rounded px-2.5 py-1 focus:border-indigo-500 focus:outline-none transition ${inputClassName}`

  // Рендеримо відповідне поле в режимі редагування
  switch (type) {
    case "textarea":
      return (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          rows={3}
          className={baseInputStyle}
        />
      )

    case "select":
      return (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          className={baseInputStyle}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-slate-950 text-slate-200"
            >
              {opt.label}
            </option>
          ))}
        </select>
      )

    case "number":
      return (
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value, "number")}
          className={baseInputStyle}
        />
      )

    default:
      return (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          className={baseInputStyle}
        />
      )
  }
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  type VerticalTab = "eoselia" | "seller" | "partner" | "valuation"

  const [leadData, setLeadData] = useState<LeadDetails | null>(null)
  const [draftChanges, setDraftChanges] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<VerticalTab>("eoselia")
  const [isEditing, setIsEditing] = useState(false)
  const session = useSession()
  const user = session.data?.user

  // Об'єкт, який бачить менеджер (оригінал + накладені поверх зміни з інпутів)
  const lead = { ...leadData, ...draftChanges }

  // Беремо ліда з бази
  useEffect(() => {
    if (!id) return

    const fetchLeadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/v1/leads/${id}`)
        if (!res.ok) throw new Error(`Помилка завантаження ліда: ${res.status}`)

        const data = await res.json()
        setLeadData(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Сталася помилка")
      } finally {
        setLoading(false)
      }
    }

    fetchLeadData()
  }, [id])

  // Авто-вибір активної таби на основі наявних даних ліда
  useEffect(() => {
    if (leadData?.has_propertyExpand || leadData?.seller_buy_budgetExpand) {
      setActiveTab("seller")
    } else if (leadData?.agency_nameExpand || leadData?.partner_flagExpand) {
      setActiveTab("partner")
    } else if (leadData?.val_addressExpand) {
      setActiveTab("valuation")
    } else {
      setActiveTab("eoselia")
    }
  }, [leadData])

  const renderVal = (val: any, fallback = "—") =>
    val !== null && val !== undefined && val !== "" ? val : fallback

  // Визначення кольору температури ліда (warmth)
  const getWarmthColor = (score: number | undefined) => {
    if (!score) return "bg-slate-700 text-slate-300"
    if (score >= 70)
      return "bg-rose-500/20 text-rose-400 border border-rose-500/30" // Гарячий
    if (score >= 40)
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30" // Теплий
    return "bg-blue-500/20 text-blue-400 border border-blue-500/30" // Холодний
  }

  // Форматування дат для читабельності менеджером
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null
    try {
      const date = new Date(dateStr)
      return date.toLocaleString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateStr
    }
  }

  // Хелпер для масивів ідентифікаторів об'єктів
  const renderIdBadges = (ids: string[] | undefined, colorClass: string) => {
    if (!ids || ids.length === 0)
      return <span className="text-xs text-slate-600">Немає</span>
    return (
      <div className="flex max-h-[60px] flex-wrap gap-1 overflow-y-auto pr-1">
        {ids.map((id, index) => (
          <span
            key={index}
            className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${colorClass}`}
          >
            #{id}
          </span>
        ))}
      </div>
    )
  }

  // Функція зміни поля в чернетці
  const handleFieldChange = (name: string, value: any, type?: string) => {
    const parsedValue =
      type === "number"
        ? value === "" || value == null
          ? null
          : Number(value)
        : value
    console.log(parsedValue)

    setDraftChanges((prev) => ({ ...prev, [name]: parsedValue }))
  }

  // Скасування змін
  const handleCancel = () => {
    setDraftChanges({})
    setIsEditing(false)
  }

  // Збереження всього пакету змін однією кнопкою
  const handleSave = async () => {
    // 1. Якщо чернетка порожня — просто закриваємо режим редагування
    if (Object.keys(draftChanges).length === 0) {
      setIsEditing(false)
      return
    }

    // Захист: якщо самого ліда немає в стейті, то й оновлювати нічого
    if (!leadData) return

    setLoading(true)
    try {
      // 2. Реальний PATCH запит на бекенд
      const response = await fetch(`/api/v1/leads/${id.trim()}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Якщо у вас використовується JWT авторизація, розкоментуй рядок нижче:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(draftChanges),
      })

      // 3. Перевірка на помилки сервера (4xx, 5xx)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData?.message || `Сервер повернув помилку: ${response.status}`
        )
      }

      // (Опціонально) Якщо твій бекенд у відповідь повертає вже оновлений об'єкт ліда:
      const updatedLead = await response.json()

      setLeadData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          ...updatedLead,
        }
      })

      // 5. Скидаємо чернетку і закриваємо інпути
      setDraftChanges({})
      setIsEditing(false)
    } catch (err) {
      console.error("🚨 Помилка під час збереження ліда:", err)
      // Тут варто додати виклик твого Toast/Notification сервісу, щоб менеджер бачив фейл
      // toast.error("Не вдалося зберегти зміни. Спробуйте ще раз.");
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoader />
  if (error || !lead) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error || "Ліда не знайдено"}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-1.5 text-xs font-medium text-indigo-400 transition hover:bg-slate-800"
          >
            ✏️ Редагувати сторінку
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs text-slate-400 transition hover:bg-slate-800"
            >
              Скасувати
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="min-w-[80px] rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              {loading ? "Збереження..." : "✓ Зберегти"}
            </button>
          </div>
        )}
      </div>
      {/* Основна сітка на дві рівні колонки */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ========================================== */}
        {/* СЕКЦІЯ 1: КОНТАКТНІ ДАНІ ТА КОМУНІКАЦІЯ    */}
        {/* ========================================== */}
        <div className="space-y-4 rounded-lg border border-slate-500/80 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              👤 Профіль та Контакти
            </h3>
            {lead.is_ukraine !== null && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${lead.is_ukraine ? "border border-blue-500/20 bg-blue-500/10 text-blue-400" : "bg-slate-800"}`}
              >
                {lead.is_ukraine ? "🇺🇦 Україна" : "🌐 Закордон"}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {/* Головне ім'я */}
            <div>
              <label className="mb-0.5 block text-xs text-slate-500">
                Повне ім'я
              </label>
              <EditableField
                isEditing={isEditing}
                name="full_name"
                value={lead.full_name}
                onChange={handleFieldChange}
              >
                <span className="text-lg font-bold tracking-wide">
                  {renderVal(lead.full_name)}
                </span>
              </EditableField>
            </div>

            {/* Телефони */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-0.5 block text-xs">
                  Телефон (введений)
                </label>
                <EditableField
                  isEditing={isEditing}
                  name="phone"
                  value={lead.phone}
                  onChange={handleFieldChange}
                >
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-mono text-sm hover:underline"
                  >
                    {renderVal(lead.phone)}
                  </a>
                </EditableField>
              </div>
              {lead.phone_normalized && (
                <div>
                  <label className="mb-0.5 block text-xs">
                    Нормалізований (Локація)
                  </label>
                  <EditableField
                    isEditing={isEditing}
                    name="phone_location"
                    value={lead.phone_location}
                    onChange={handleFieldChange}
                  >
                    <span className="block font-mono text-sm">
                      {lead.phone_normalized}{" "}
                      {lead.phone_location ? `(${lead.phone_location})` : ""}
                    </span>
                  </EditableField>
                </div>
              )}
            </div>

            {/* Соціалки та месенджери */}
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <div>
                <label className="mb-0.5 block text-xs">Telegram</label>
                {lead.username ? (
                  <a
                    href={`https://t.me/${lead.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-sky-400 hover:underline"
                  >
                    @{lead.username}
                  </a>
                ) : lead.telegram_id ? (
                  <span className="font-mono text-sm">
                    ID: {lead.telegram_id}
                  </span>
                ) : (
                  <span className="text-sm text-slate-600">—</span>
                )}
              </div>
              <div>
                <label className="mb-0.5 block text-xs">
                  Пріоритетний зв'язок
                </label>
                <span className="inline-block rounded text-sm font-medium">
                  {renderVal(lead.preferred_comm, "Не вказано")}
                </span>
              </div>
              {user?.role == "ADMIN" && (
                <div>
                  <label className="mb-0.5 block text-xs">Менеджер</label>
                  <span className="inline-block rounded text-sm font-medium">
                    <EditableField
                      isEditing={isEditing}
                      name="manager_id"
                      value={lead.manager_id}
                      type="number"
                      onChange={handleFieldChange}
                    >
                      {lead.manager_id ? (
                        <span className="inline-block rounded text-sm font-medium">
                          <Link href={`/managers/${lead.manager_id}`}>
                            ID: {lead.manager_id}
                          </Link>
                        </span>
                      ) : (
                        <span className="inline-block rounded text-sm font-medium">
                          Невказано
                        </span>
                      )}
                    </EditableField>
                  </span>
                </div>
              )}
            </div>

            {/* Додаткові месенджери та Таймзона */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lead.messengers && (
                <div>
                  <label className="mb-0.5 block text-xs">Всі месенджери</label>
                  <span className="block text-sm">{lead.messengers}</span>
                </div>
              )}
              {lead.client_timezoneExpand && (
                <div>
                  <label className="mb-0.5 block text-xs text-slate-500">
                    Часовий пояс клієнта
                  </label>
                  <span className="block font-mono text-sm">
                    🕒 {lead.client_timezoneExpand}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* СЕКЦІЯ 2: СТАТУС ТА УПРАВЛІННЯ ПАЙПЛАЙНОМ  */}
        {/* ========================================== */}
        <div className="space-y-4 rounded-lg border border-slate-500/80 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              ⚙️ Пайплайн та Таймінг
            </h3>
            {lead.priority && (
              <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
                🔥 {lead.priority}
              </span>
            )}
          </div>

          {/* Лейбли статусів */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border border-slate-800 p-2 text-center">
              <span className="block text-[10px] font-medium uppercase">
                Поточний статус
              </span>
              <EditableField
                isEditing={isEditing}
                name="status"
                value={lead.status}
                onChange={handleFieldChange}
                type="select"
                options={Object.entries(LEAD_STATUS_CONFIG).map(
                  ([key, config]) => ({
                    value: key,
                    label: config.label,
                  })
                )}
              >
                <span
                  className={`mt-0.5 block text-sm font-bold ${LEAD_STATUS_CONFIG[lead.status as keyof typeof LEAD_STATUS_CONFIG]?.css}`}
                >
                  {renderVal(
                    LEAD_STATUS_CONFIG[
                      lead.status as keyof typeof LEAD_STATUS_CONFIG
                    ]?.label
                  )}
                </span>
              </EditableField>
            </div>
            <div className="rounded border border-slate-800 p-2 text-center">
              <span className="block text-[10px] font-medium text-slate-500 uppercase">
                Роль ліда
              </span>
              <EditableField
                isEditing={isEditing}
                name="role"
                value={lead.role}
                onChange={handleFieldChange}
                type="select"
                options={Object.entries(LEAD_ROLE_CONFIG).map(
                  ([key, config]) => ({
                    value: key,
                    label: config.label,
                  })
                )}
              >
                <span className="mt-0.5 block text-sm font-bold text-indigo-400">
                  {renderVal(
                    LEAD_ROLE_CONFIG[lead.role as keyof typeof LEAD_ROLE_CONFIG]
                      ?.label
                  )}
                </span>
              </EditableField>
            </div>
          </div>

          {/* Операційні теги списком */}
          <div className="flex flex-wrap gap-2 pt-1">
            {lead.stage && (
              <span className="rounded px-2 py-1 text-xs">
                Етап:{" "}
                <EditableField
                  isEditing={isEditing}
                  name="stage"
                  value={lead.stage}
                  onChange={handleFieldChange}
                >
                  <strong>{lead.stage}</strong>
                </EditableField>
              </span>
            )}
            {lead.contact_status && (
              <span className="rounded px-2 py-1 text-xs">
                Статус контакту:{" "}
                <EditableField
                  isEditing={isEditing}
                  name="contact_status"
                  value={lead.contact_status}
                  onChange={handleFieldChange}
                >
                  <strong>{lead.contact_status}</strong>
                </EditableField>
              </span>
            )}
            {lead.priority && (
              <span className="rounded border border-red-900/50 px-2 py-1 text-xs">
                Приоритет: <strong>{lead.priority}</strong>
              </span>
            )}
            {lead.warmth !== null && (
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${getWarmthColor(lead.warmth)}`}
              >
                Температура: <strong>{lead.warmth}°C</strong>
              </span>
            )}
            {lead.result && (
              <span className="mt-1 block w-full rounded border border-emerald-900/40 px-2 py-1 text-xs text-emerald-400">
                Результат етапу: {lead.result}
              </span>
            )}
          </div>

          {/* ДЕДЛАЙНИ ТА ТАЙМ-МЕНЕДЖМЕНТ (Критично для менеджера) */}
          <div className="grid grid-cols-1 gap-3 border-t border-slate-800/60 pt-3 sm:grid-cols-2">
            <div>
              <label className="mb-0.5 block text-xs font-medium text-amber-500">
                📅 Наступний крок (Next Step)
              </label>
              <span
                className={`block font-mono text-sm font-semibold ${lead.next_step_date ? "text-amber-400" : "text-slate-600"}`}
              >
                {lead.next_step_date
                  ? `👇 ${formatDate(lead.next_step_date)}`
                  : "Не заплановано"}
              </span>
            </div>
            <div>
              <label className="mb-0.5 block text-xs font-medium text-blue-400">
                💤 Відкладено до (Snooze)
              </label>
              <span className="block font-mono text-sm text-slate-300">
                {lead.snooze_until
                  ? `⏳ ${formatDate(lead.snooze_until)}`
                  : "Активний в роботі"}
              </span>
            </div>
          </div>

          {/* Системні дати створення/взяття в роботу */}
          <div className="grid grid-cols-2 gap-1 border-t border-slate-800/40 pt-2 font-mono text-[11px] text-slate-500">
            <div>Створено: {formatDate(lead.assigned_at) || "--"}</div>
            <div>
              Взято в роботу: {formatDate(lead.taken_in_work_at) || "--"}
            </div>
            {lead.expected_closing_date && (
              <div className="col-span-2 text-indigo-400/80">
                Очікуване закриття:{" "}
                {formatDate(lead.expected_closing_date) || "--"}
              </div>
            )}
            {lead.closure_date && (
              <div className="col-span-2 text-rose-400/80">
                Дата закриття/архіву: {formatDate(lead.closure_date) || "--"}
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* СЕКЦІЯ 3: ШІ АНАЛІТИКА (ТОП-ПРІОРИТЕТ)     */}
        {/* ========================================== */}
        {(lead.ai_summaryExpand || lead.ai_scoreExpand) && (
          <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-indigo-500/30 bg-indigo-950/40 p-4 md:flex-row">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-indigo-400 uppercase">
                <span>⚡ ШІ СУМАРІЗАТОР</span>
              </div>
              <p className="text-sm leading-relaxed text-indigo-200/90 italic">
                {renderVal(
                  lead.ai_summaryExpand,
                  "ШІ ще не сформував висновок по клієнту."
                )}
              </p>
            </div>
            {lead.ai_scoreExpand !== null && (
              <div className="flex min-w-[90px] flex-col items-center justify-center self-stretch rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-3 text-center md:self-auto">
                <span className="text-xs font-medium text-indigo-400 uppercase">
                  AI Score
                </span>
                <span className="text-2xl font-bold text-indigo-300">
                  {lead.ai_scoreExpand}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================== */}
        {/* 4. ПОТРЕБА: ПАРАМЕТРИ НЕРУХОМОСТІ                                        */}
        {/* ======================================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-500/80 p-4 shadow-xl">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
                🏠 Критерії Нерухомості
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Тип нерухомості
                </label>
                <span className="block text-sm font-bold">
                  {renderVal(lead.property_type)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Назва ЖК / Об'єкта
                </label>
                <span className="block truncate text-sm font-medium text-indigo-400">
                  {renderVal(lead.property_name)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Район / Локація
                </label>
                <span className="block text-sm">
                  {renderVal(lead.district)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Кількість кімнат
                </label>
                <span className="block font-mono text-sm text-slate-300">
                  🛏️ {renderVal(lead.rooms)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Поверх / Поверховість
                </label>
                <span className="block font-mono text-sm">
                  🏢 {lead.floor ? `${lead.floor} пов.` : ""}{" "}
                  {lead.floor_info
                    ? `(${lead.floor_info})`
                    : lead.floor
                      ? ""
                      : "—"}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Площа об'єкта
                </label>
                <span className="block font-mono text-sm">
                  📐 {lead.area ? `${lead.area} м²` : "—"}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Ремонт
                </label>
                <span className="block text-sm">{renderVal(lead.repair)}</span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Ціль / Формат
                </label>
                <span className="mt-0.5 inline-block rounded text-xs font-medium">
                  {lead.purpose ? `${lead.purpose}` : ""}{" "}
                  {lead.format ? `[${lead.format}]` : lead.purpose ? "" : "—"}
                </span>
              </div>
            </div>

            {/* Текстові запити (Коментарі клієнта) */}
            <div className="space-y-2 border-t border-slate-800/60 pt-2">
              {lead.main_requestExpand && (
                <div className="rounded border border-slate-800 bg-slate-950/40 p-2.5">
                  <label className="mb-1 block text-[10px] font-bold text-indigo-400 uppercase">
                    🎯 Головний запит
                  </label>
                  <p className="text-xs leading-relaxed">
                    {lead.main_requestExpand}
                  </p>
                </div>
              )}
              {lead.wishes && (
                <div className="rounded border border-slate-800 bg-slate-950/40 p-2.5">
                  <label className="mb-1 block text-[10px] font-bold text-slate-500 uppercase">
                    💭 Побажання клієнта
                  </label>
                  <p className="text-xs leading-relaxed">{lead.wishes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 5. ФІНАНСОВИЙ ПРОФІЛЬ (BUDGET)                                           */}
        {/* ======================================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-500/80 p-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
                💰 Фінансовий Профіль
              </h3>
              {lead.finance_format && (
                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase">
                  {lead.finance_format}
                </span>
              )}
            </div>

            {/* Основний Головний Бюджет */}
            <div className="rounded-lg border border-emerald-500/20 p-3 text-center">
              <span className="block text-[10px] font-bold text-emerald-500 uppercase">
                Загальний Бюджет
              </span>

              <span className="mt-0.5 block text-xl font-black text-emerald-400">
                {lead.budget
                  ? lead.budget
                  : lead.budget_min || lead.budget_max
                    ? `${renderVal(lead.budget_min)} - ${renderVal(lead.budget_max)}`
                    : "Не визначено"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Перший внесок
                </label>
                <span className="block font-mono text-sm font-bold">
                  {renderVal(lead.down_payment)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Очікувана ціна об'єкта
                </label>
                <span className="block font-mono text-sm">
                  {renderVal(lead.expected_price)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Розрахунковий платіж
                </label>
                <span className="block font-mono text-sm">
                  {renderVal(lead.calculated_payment || lead.monthly_payment)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Доплата / Дофінансування
                </label>
                <span className="block font-mono text-sm text-slate-300">
                  {renderVal(lead.surcharge)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Дохід ліда (Місяць)
                </label>
                <span className="block font-mono text-sm text-slate-400">
                  {renderVal(lead.income)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs text-slate-500">
                  Загальний сімейний дохід
                </label>
                <span className="block font-mono text-sm text-slate-400">
                  {renderVal(lead.family_income)}
                </span>
              </div>
            </div>

            {/* Фінальна цінність ліда якщо є угода */}
            {lead.deal_value && (
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                <span className="font-medium text-slate-500 uppercase">
                  Вартість поточної угоди:
                </span>
                <span className="rounded border border-slate-800 bg-slate-950 px-2 py-1 font-mono font-bold text-white">
                  {lead.deal_value}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 6. ВЗАЄМОДІЯ З ОБ'ЄКТАМИ (КЛІЄНТСЬКИЙ ДОСВІД)                            */}
        {/* ======================================================================== */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-500/80 p-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
                🎯 Взаємодія з Об'єктами
              </h3>
              {lead.variants_sentExpand && (
                <span className="rounded border border-sky-500/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-400 uppercase">
                  Підбірка надіслана
                </span>
              )}
            </div>

            {/* Воронка метрик об'єктів */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded border border-slate-800 p-1.5">
                <span className="block text-[9px] uppercase">Знайдено</span>
                <span className="font-mono text-sm font-bold">
                  {renderVal(lead.variants_foundExpand, "0")}
                </span>
              </div>
              <div className="rounded border border-slate-800 p-1.5">
                <span className="block text-[9px] uppercase">Перегляди</span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {renderVal(lead.showing_countExpand, "0")}
                </span>
              </div>
              <div className="rounded border border-slate-800 p-1.5">
                <span className="block text-[9px] uppercase">
                  Режим підбору
                </span>
                <span className="block truncate text-[11px] font-medium">
                  {renderVal(lead.selection_modeExpand)}
                </span>
              </div>
            </div>

            {/* Текстові тригери та реакції */}
            <div className="space-y-2 rounded-lg border border-slate-800/60 p-2.5 text-xs">
              <div className="flex justify-between">
                <span>Головна дія клієнта:</span>
                <span className="font-semibold">
                  {renderVal(lead.primary_actionExpand)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="shrink-0">Фідбек клієнта:</span>
                <span className="text-right italic">
                  {renderVal(lead.reaction_clientExpand)}
                </span>
              </div>
            </div>

            {/* Ідентифікатори об'єктів (Масиви списком) */}
            <div className="space-y-2 border-t border-slate-800/40 pt-1 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="mb-1 block text-[10px]">
                    🔥 Хочуть перегляд:
                  </span>
                  {renderIdBadges(
                    lead.view_requested_idsExpand ||
                      (lead.wants_viewing_idExpand
                        ? [lead.wants_viewing_idExpand]
                        : undefined),
                    "bg-red-500/10 border border-red-500/20"
                  )}
                </div>
                <div>
                  <span className="mb-1 block text-[10px]">
                    ❤️ Сподобались (Лайки):
                  </span>
                  {renderIdBadges(
                    lead.liked_objects_idsExpand,
                    "bg-rose-500/10 border border-rose-500/20"
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="mb-1 block text-[10px]">
                    🔗 Матчі системи:
                  </span>
                  {renderIdBadges(
                    lead.matched_objects_idsExpand,
                    "bg-slate-800 border border-slate-700"
                  )}
                </div>
                <div>
                  <span className="mb-1 block text-[10px]">
                    ❓ Питання по об'єктах:
                  </span>
                  {renderIdBadges(
                    lead.questions_idsExpand,
                    "bg-amber-500/10 border border-amber-500/20"
                  )}
                </div>
              </div>
            </div>

            {/* Точкові об'єкти з каруселі/історії */}
            {(lead.selected_object_idExpand ||
              lead.obj1_idExpand ||
              lead.obj2_idExpand ||
              lead.obj3_idExpand) && (
              <div className="flex items-center justify-between border-t border-slate-800/40 pt-2 text-[11px]">
                <span>Фіксовані ID:</span>
                <div className="flex gap-1.5 font-mono">
                  {lead.selected_object_idExpand && (
                    <span className="font-bold">
                      ★ #{lead.selected_object_idExpand}
                    </span>
                  )}
                  {lead.obj1_idExpand && <span>#1:{lead.obj1_idExpand}</span>}
                  {lead.obj2_idExpand && <span>#2:{lead.obj2_idExpand}</span>}
                  {lead.obj3_idExpand && <span>#3:{lead.obj3_idExpand}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 7. ЗАКРИТТЯ, ФІДБЕК ТА НОТАТКИ (Коментарі та Болі)                        */}
        {/* ======================================================================== */}
        <div className="space-y-4 rounded-xl border border-slate-500/80 p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              📝 Історія взаємин та Нотатки
            </h3>
            {lead.followup_levelExpand !== null && (
              <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] text-indigo-400">
                Follow-up Lvl: {lead.followup_levelExpand || "null"}
              </span>
            )}
          </div>

          {/* Коментарі менеджера */}
          <div className="space-y-3">
            <div>
              <label className="mb-0.5 block text-xs">
                Основний коментар / Нотатка
              </label>
              <div className="rounded border border-slate-800/80 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                {renderVal(lead.commentExpand, "Коментарі відсутні")}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-0.5 block text-xs">
                  Нотатки щодо статусу
                </label>
                <span className="block rounded border border-slate-800/40 p-2 text-xs">
                  {renderVal(lead.status_notesExpand)}
                </span>
              </div>
              <div>
                <label className="mb-0.5 block text-xs">
                  Зворотній зв'язок (Feedback)
                </label>
                <span className="block rounded border border-slate-800/40 p-2 text-xs italic">
                  "{renderVal(lead.feedbackExpand)}"
                </span>
              </div>
            </div>

            {/* БЛОК ВІДМОВИ / АРХІВУ (Рендериться тільки якщо є причина відмови) */}
            {(lead.loss_reasonExpand ||
              lead.reason_refusalExpand ||
              lead.reason_urgentExpand) && (
              <div className="space-y-2 rounded-lg border border-rose-500/20 p-3">
                <span className="block text-[10px] font-bold tracking-wide uppercase">
                  🚨 Причини архіву / втрати ліда
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                  <div>
                    <span className="block">Причина втрати:</span>
                    <strong>{renderVal(lead.loss_reasonExpand)}</strong>
                  </div>
                  <div>
                    <span className="block">Причина відмови:</span>
                    <strong>{renderVal(lead.reason_refusalExpand)}</strong>
                  </div>
                  <div>
                    <span className="block">Терміновість / Форс-мажор:</span>
                    <strong>{renderVal(lead.reason_urgentExpand)}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Додаткові нотатки після опитування */}
            {lead.post_survey_commentExpand && (
              <div className="rounded border border-slate-800 p-2.5 text-xs">
                <span className="mb-1 block font-medium">
                  Коментар після опитування:
                </span>
                <p className="text-slate-400 italic">
                  {lead.post_survey_commentExpand}
                </p>
              </div>
            )}

            {/* Таймінги активностей */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2 font-mono text-[11px] text-slate-500">
              <div>
                Остання дія клієнта:{" "}
                <span className="text-slate-400">
                  {formatDate(lead.last_client_activity) || "—"}
                </span>
              </div>
              <div>
                Останній Follow-up:{" "}
                <span className="text-slate-400">
                  {formatDate(lead.last_followup_at) || "—"}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-between pt-1">
                <span>
                  Останній крок:{" "}
                  <strong className="font-sans text-indigo-400/90">
                    {renderVal(lead.last_stepExpand)}
                  </strong>
                </span>
                {lead.is_reminder_sentExpand && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase">
                    🔔 Нагадування відправлено
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 8. СПЕЦИФІЧНІ СЦЕНАРІЇ / ВЕРТИКАЛІ (Розумна таб-система)                   */}
        {/* ======================================================================== */}
        <div className="overflow-hidden rounded-xl border border-slate-500/80 shadow-xl">
          {/* Клікабельні Хедери Табів */}
          <div className="flex flex-wrap border-b border-slate-800 bg-slate-950/10">
            <button
              onClick={() => setActiveTab("eoselia")}
              className={`border-b-2 px-5 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 ${activeTab === "eoselia" ? "border-indigo-500 bg-slate-900/20 text-indigo-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              🏛️ єОселя / Державні програми
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`border-b-2 px-5 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 ${activeTab === "seller" ? "border-amber-500 bg-slate-900/20 text-amber-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              🔑 Продаж власної
            </button>
            <button
              onClick={() => setActiveTab("partner")}
              className={`border-b-2 px-5 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 ${activeTab === "partner" ? "border-sky-500 bg-slate-900/20 text-sky-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              🤝 Партнери / Агенції
            </button>
            <button
              onClick={() => setActiveTab("valuation")}
              className={`border-b-2 px-5 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 ${activeTab === "valuation" ? "border-emerald-500 bg-slate-900/20 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              📊 Послуга Оцінки
            </button>
          </div>

          {/* Контент табів */}
          <div className="min-h-[160px] p-4">
            {/* TAB 1: єОСЕЛЯ */}
            {activeTab === "eoselia" && (
              <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Готовність до програми єОселя
                  </label>
                  <span className="block text-sm font-bold">
                    {renderVal(lead.eoselia_readyExpand)}
                  </span>
                </div>
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Категорія пільг
                  </label>
                  <span className="block text-sm font-medium">
                    {renderVal(lead.benefit_categoryExpand)}
                  </span>
                </div>
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Соціальний статус
                  </label>
                  <span className="block">
                    {renderVal(lead.social_statusExpand)}
                  </span>
                </div>
                <div className="col-span-1 grid grid-cols-2 gap-2 rounded-lg border border-slate-800/80 p-3 md:col-span-2">
                  <div>
                    🌐 Має житло:{" "}
                    <strong>{renderVal(lead.social_has_housingExpand)}</strong>
                  </div>
                  <div>
                    📋 Стоїть у черзі:{" "}
                    <strong>{renderVal(lead.social_on_queueExpand)}</strong>
                  </div>
                  <div>
                    💰 Отримав компенсацію:{" "}
                    <strong>
                      {renderVal(lead.social_received_compExpand)}
                    </strong>
                  </div>
                  <div>
                    ♿ Доступність/Інклюзія:{" "}
                    <strong>{renderVal(lead.accessibilityExpand)}</strong>
                  </div>
                </div>
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Рекомендації / Деталі соціалки
                  </label>
                  <p className="font-serif italic">
                    "
                    {renderVal(
                      lead.social_recommendationExpand ||
                        lead.eoselia_detailsExpand
                    )}
                    "
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ПРОДАВЕЦЬ */}
            {activeTab === "seller" && (
              <div className="space-y-4 text-xs">
                <div className="flex w-fit items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5">
                  <span>Має об'єкт на продаж:</span>
                  <strong className={`rounded px-2 py-0.5 uppercase`}>
                    {lead.has_propertyExpand ? "Так" : "Ні / Не вказано"}
                  </strong>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-0.5 block text-slate-500">
                      Загальна площа об'єкта
                    </label>
                    <span className="block font-mono text-sm">
                      {lead.total_area_existingExpand
                        ? `${lead.total_area_existingExpand} м²`
                        : renderVal(lead.existing_areaExpand)}
                    </span>
                  </div>
                  <div>
                    <label className="mb-0.5 block text-slate-500">
                      Статус будівлі / Рік
                    </label>
                    <span className="block">
                      {renderVal(lead.building_statusExpand)}
                    </span>
                  </div>
                  <div>
                    <label className="mb-0.5 block text-slate-500">
                      Тип власності
                    </label>
                    <span className="block">
                      {renderVal(lead.ownership_typeExpand)}
                    </span>
                  </div>
                  <div>
                    <label className="mb-0.5 block text-slate-500">
                      Чи продає зараз?
                    </label>
                    <span className="block font-semibold">
                      {lead.selling_currentExpand === null
                        ? "—"
                        : lead.selling_currentExpand
                          ? "🔥 Активно продає"
                          : "Ні/Думає"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-slate-800 p-3">
                  <span className="block text-[10px] font-bold tracking-wider text-amber-500 uppercase">
                    Зворотна покупка продавця (Що хоче взамін)
                  </span>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div>
                      Кімнат:{" "}
                      <strong>{renderVal(lead.seller_buy_roomsExpand)}</strong>
                    </div>
                    <div>
                      Район:{" "}
                      <strong>
                        {renderVal(lead.seller_buy_districtExpand)}
                      </strong>
                    </div>
                    <div>
                      Бюджет:{" "}
                      <strong className="text-emerald-500">
                        {renderVal(lead.seller_buy_budgetExpand)}
                      </strong>
                    </div>
                    <div>
                      Сума доплати:{" "}
                      <strong>
                        {renderVal(lead.seller_buy_surchargeExpand)}
                      </strong>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 border-t border-slate-900 pt-1">
                    <div>
                      Тип зустрічної:{" "}
                      <span>{renderVal(lead.seller_buy_typeExpand)}</span>
                    </div>
                    <div>
                      Готові документи:{" "}
                      <span>
                        {lead.documents_readyExpand ? "✅ Так" : "❌ Ні"}
                      </span>
                    </div>
                    <div>
                      Зустрічна покупка:{" "}
                      <span>
                        {lead.counter_purchaseExpand ? "🔄 Потрібна" : "Ні"}
                      </span>
                    </div>
                    <div>
                      План після продажу:{" "}
                      <span className="text-slate-300 italic">
                        "{renderVal(lead.post_sale_planExpand)}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ПАРТНЕРИ */}
            {activeTab === "partner" && (
              <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Назва Агенції / Партнера
                  </label>
                  <span className="block text-sm font-bold text-sky-400">
                    {renderVal(lead.agency_nameExpand, "Приватний ріелтор")}
                  </span>
                </div>
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Тип партнерства
                  </label>
                  <span className="block">
                    {renderVal(lead.partnership_typeExpand)}
                  </span>
                </div>
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Статус партнера
                  </label>
                  <span className="mt-0.5 inline-block rounded border border-sky-800 px-2 py-0.5 text-xs font-medium">
                    {renderVal(lead.partner_statusExpand)}
                  </span>
                </div>
                <div>
                  <label className="mb-0.5 block text-slate-500">
                    Винагорода партнера
                  </label>
                  <span className="block font-mono text-sm font-bold">
                    {renderVal(lead.partner_rewardExpand)}
                  </span>
                </div>
                <div className="col-span-2 rounded border border-slate-800 p-2.5">
                  <span className="mb-1 block text-slate-500">
                    Інформація про клієнта від партнера:
                  </span>
                  <p className="italic">
                    "{renderVal(lead.partner_client_infoExpand)}"
                  </p>
                </div>
                <div className="space-y-1">
                  <div>
                    Джерело партнера:{" "}
                    <strong>{renderVal(lead.partner_sourceExpand)}</strong>
                  </div>
                  <div>
                    Формат співпраці:{" "}
                    <strong>{renderVal(lead.partner_formatExpand)}</strong>
                  </div>
                  <div>
                    Флаг партнера:{" "}
                    <strong>{lead.partner_flagExpand ? "Так" : "Ні"}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ОЦІНКА */}
            {activeTab === "valuation" && (
              <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="mb-0.5 block text-slate-500">
                      Адреса об'єкта для оцінки
                    </label>
                    <span className="block text-sm font-bold">
                      📍 {renderVal(lead.val_addressExpand)}
                    </span>
                  </div>
                  <div>
                    <label className="mb-0.5 block text-slate-500">
                      Ціль / Причина оцінки
                    </label>
                    <span className="block">
                      {renderVal(lead.val_reasonExpand)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-800/80 bg-slate-950/10 p-3 sm:grid-cols-2">
                  <div>
                    📋 Тип оцінки:{" "}
                    <strong>{renderVal(lead.valuation_typeExpand)}</strong>
                  </div>
                  <div>
                    🛋️ Стан меблів:{" "}
                    <strong>{renderVal(lead.valuation_furnitureExpand)}</strong>
                  </div>
                  <div className="border-t border-slate-900 pt-1 sm:col-span-2">
                    🛠️ Ремонт об'єкта:{" "}
                    <strong className="font-sans">
                      {renderVal(lead.valuation_repairExpand)}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 9. КВАЛІФІКАЦІЯ ТА ОПИТУВАННЯ (Дані з ботів / квізів)                    */}
        {/* ======================================================================== */}
        <div className="space-y-4 rounded-xl border border-slate-500/80 p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              🤖 Первинний зріз / Дані Чат-бота
            </h3>
            <div className="flex gap-2">
              <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                {renderVal(
                  lead.survey_status_label || lead.survey_statusExpand,
                  "Статус квізу"
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2 flex items-center justify-between rounded border border-slate-500/80 p-2.5">
              <div>
                <span className="mb-0.5 block text-slate-500">
                  Кваліфікаційний статус
                </span>
                <strong className="text-sm">
                  {renderVal(
                    lead.qualification_statusExpand,
                    "Не кваліфіковано"
                  )}
                </strong>
              </div>
              <div className="text-right">
                <span className="mb-0.5 block text-slate-500">
                  Прогрес опитування
                </span>
                <span className="rounded border border-slate-800 px-2 py-0.5 font-mono font-bold">
                  {renderVal(lead.survey_progressExpand, "0%")}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-0.5 block text-slate-500">
                Готовність до підбору
              </label>
              <span className="block font-medium">
                {renderVal(
                  lead.readiness_for_selectionExpand ||
                    lead.readiness_for_selection
                )}
              </span>
            </div>
            <div>
              <label className="mb-0.5 block text-slate-500">
                Причина інтересу
              </label>
              <EditableField
                isEditing={isEditing}
                name="interest_reason"
                value={lead.interest_reason}
                onChange={handleFieldChange}
              >
                <span className="block font-medium">
                  {renderVal(lead.interest_reason)}
                </span>
              </EditableField>
            </div>
            <div>
              <label className="mb-0.5 block text-slate-500">
                Склад сім'ї / Учасники
              </label>
              <span className="block">👨‍👩‍👧‍👦 {renderVal(lead.family_members)}</span>
            </div>
            <div>
              <label className="mb-0.5 block text-slate-500">
                Покупка для себе?
              </label>
              <span className={`font-semibold`}>
                {lead.is_for_clientExpand === null
                  ? "—"
                  : lead.is_for_clientExpand
                    ? "Так, для себе"
                    : "Ні, для клієнта (посередник)"}
              </span>
            </div>
          </div>

          {/* Системні логи бота */}
          <div className="space-y-2 border-t border-slate-800/60 pt-3">
            <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Технічна карта воронки бота
            </span>
            <div className="grid grid-cols-2 gap-2 rounded border border-slate-500/80 p-2.5 font-mono text-[11px]">
              <div>
                Назва воронки:{" "}
                <span className="font-sans">
                  {renderVal(lead.funnel_nameExpand)}
                </span>
              </div>
              <div>
                Сценарій:{" "}
                <span className="font-sans">
                  {renderVal(lead.scenarioExpand || lead.scenario_typeExpand)}
                </span>
              </div>
              <div>
                Етап у боті (719):{" "}
                <span>{renderVal(lead.stage_719Expand)}</span>
              </div>
              <div>
                ID Сценарію: <span>{renderVal(lead.scenario_idExpand)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
