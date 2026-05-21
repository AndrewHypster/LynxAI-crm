"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageLoader } from "@/components/loading"
import { LEAD_ROLE_CONFIG, LEAD_STATUS_CONFIG, LeadDetails } from "@/lib/constants"
import Link from "next/link"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [lead, setLead] = useState<LeadDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchLeadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/v1/leads/${id}`)
        if (!res.ok) throw new Error(`Помилка завантаження ліда: ${res.status}`)

        const data = await res.json()
        setLead(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Сталася помилка")
      } finally {
        setLoading(false)
      }
    }

    fetchLeadData()
  }, [id])

  const renderVal = (val: any, fallback = "—") =>
    val !== null && val !== undefined && val !== "" ? val : fallback

  // Визначення кольору температури ліда (warmth)
  const getWarmthColor = (score: number | null) => {
    if (!score) return "bg-slate-700 text-slate-300"
    if (score >= 70)
      return "bg-rose-500/20 text-rose-400 border border-rose-500/30" // Гарячий
    if (score >= 40)
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30" // Теплий
    return "bg-blue-500/20 text-blue-400 border border-blue-500/30" // Холодний
  }

  // Форматування дат для читабельності менеджером
  const formatDate = (dateStr: string | null) => {
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
              <span className="text-lg font-bold tracking-wide">
                {renderVal(lead.full_name)}
              </span>
            </div>

            {/* Телефони */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-0.5 block text-xs">
                  Телефон (введений)
                </label>
                <a
                  href={`tel:${lead.phone}`}
                  className="font-mono text-sm hover:underline"
                >
                  {renderVal(lead.phone)}
                </a>
              </div>
              {lead.phone_normalized && (
                <div>
                  <label className="mb-0.5 block text-xs">
                    Нормалізований (Локація)
                  </label>
                  <span className="block font-mono text-sm">
                    {lead.phone_normalized}{" "}
                    {lead.phone_location ? `(${lead.phone_location})` : ""}
                  </span>
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
              <span
                className={`mt-0.5 block text-sm font-bold ${LEAD_STATUS_CONFIG[lead.status as keyof typeof LEAD_STATUS_CONFIG]?.css}`}
              >
                {renderVal(
                  LEAD_STATUS_CONFIG[
                    lead.status as keyof typeof LEAD_STATUS_CONFIG
                  ]?.label
                )}
              </span>
            </div>
            <div className="rounded border border-slate-800 p-2 text-center">
              <span className="block text-[10px] font-medium text-slate-500 uppercase">
                Роль ліда
              </span>
              <span className="mt-0.5 block text-sm font-bold text-indigo-400">
                {renderVal(
                  LEAD_ROLE_CONFIG[lead.role as keyof typeof LEAD_ROLE_CONFIG]
                    ?.label
                )}
              </span>
            </div>
          </div>

          {/* Операційні теги списком */}
          <div className="flex flex-wrap gap-2 pt-1">
            {lead.stage && (
              <span className="rounded px-2 py-1 text-xs text-slate-300">
                Етап: <strong className="text-white">{lead.stage}</strong>
              </span>
            )}
            {lead.contact_status && (
              <span className="rounded px-2 py-1 text-xs text-slate-300">
                Статус контакту:{" "}
                <strong className="text-white">{lead.contact_status}</strong>
              </span>
            )}
            {lead.action_priority && (
              <span className="rounded border border-red-900/50 px-2 py-1 text-xs text-red-400">
                Дія: <strong>{lead.action_priority}</strong>
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
            <div>Створено: {formatDate(lead.assigned_at)}</div>
            <div>Взято в роботу: {formatDate(lead.taken_in_work_at)}</div>
            {lead.expected_closing_date && (
              <div className="col-span-2 text-indigo-400/80">
                Очікуване закриття: {formatDate(lead.expected_closing_date)}
              </div>
            )}
            {lead.closure_date && (
              <div className="col-span-2 text-rose-400/80">
                Дата закриття/архіву: {formatDate(lead.closure_date)}
              </div>
            )}
          </div>
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
    </div>
  )
}
