"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageLoader } from "@/components/loading"
import { LeadDetails } from "@/lib/constants"
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
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-gray-50 p-6 text-gray-900 transition-colors duration-200 dark:bg-transparent dark:text-gray-100">
      {/* Хедер сторінки */}
      <div className="flex items-center justify-between rounded-xl border-b border-gray-200 bg-white p-4 pb-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.05]">
        <div>
          <button
            onClick={() => router.push("/leads")}
            className="mb-1 block text-xs font-semibold tracking-wider uppercase transition-colors hover:opacity-80"
            style={{ color: "#a55dff" }}
          >
            ← назад до списку
          </button>
          <h1 className="text-2xl font-bold tracking-tight">
            {lead.full_name || "Без імені"}{" "}
            <span className="font-normal text-gray-400 dark:text-gray-500">
              #{lead.id}
            </span>
          </h1>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {lead.role_label}
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: "#7C1DF2" }}
          >
            {lead.status_label}
          </span>
        </div>
      </div>

      {/* Головна сітка блоків */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* БЛОК 1: Основні контакти */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.05]">
          <h2 className="text-md border-b border-gray-100 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
            👤 Контактна інформація
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Телефон
              </span>
              <span className="font-medium">{lead.phone || "Не вказано"}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Telegram username
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {lead.username ? (
                  <Link href={`https://t.me/${lead.username}`} target="_blank">@{lead.username}</Link>
                ) : (
                  "Відсутній"
                )}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Локація
              </span>
              <span className="font-medium">
                {lead.is_ukraine ? "🇺🇦 Україна" : "🌐 Закордон"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Пріоритет комунікації
              </span>
              <span className="font-medium uppercase">
                {lead.preferred_comm || "Не визначено"}
              </span>
            </div>
          </div>
        </div>

        {/* БЛОК 2: Запит нерухомості & Бюджет */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.05]">
          <h2 className="text-md border-b border-gray-100 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
            🏢 Параметри підбору
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Бюджет
              </span>
              <span className="text-lg font-bold" style={{ color: "#a55dff" }}>
                {lead.budget ? `${lead.budget} $` : "Не вказано"}
              </span>
              {(lead.budget_min || lead.budget_max) && (
                <span className="block text-xs text-gray-400 dark:text-gray-500">
                  від {lead.budget_min}$ до {lead.budget_max}$
                </span>
              )}
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Тип об'єкта / Кімнат
              </span>
              <span className="font-medium">
                {lead.property_type || "Квартира"} / {lead.rooms || "—"} к.
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Район
              </span>
              <span className="font-medium">
                {lead.district || "Не вибрано"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Готовність до єОселі
              </span>
              <span className="font-medium">
                {lead.eoselia_readyExpand || "Ні / Невідомо"}
              </span>
            </div>
          </div>
          {lead.wishes && (
            <div className="border-t border-gray-100 pt-2 text-sm dark:border-gray-800">
              <span className="mb-1 block text-xs text-gray-400 dark:text-gray-500">
                Побажання клієнта:
              </span>
              <p className="rounded-lg bg-gray-50 p-2.5 text-xs text-gray-700 italic dark:bg-gray-950 dark:text-gray-300">
                {lead.wishes}
              </p>
            </div>
          )}
        </div>

        {/* БЛОК 3: Маркетинг & Таймлайн */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.05]">
          <h2 className="text-md border-b border-gray-100 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
            📊 Системні дані & Маркетинг
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Джерело (UTM Source)
              </span>
              <span className="mt-0.5 inline-block rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 uppercase dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                {lead.utm_source || "organic"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Кампанія
              </span>
              <span className="block max-w-[180px] truncate text-xs font-medium">
                {lead.utm_campaign || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Дата створення
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {new Date(lead.created_at).toLocaleString("uk-UA")}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Остання активність
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {lead.last_client_activity
                  ? new Date(lead.last_client_activity).toLocaleString("uk-UA")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* БЛОК 4: AI Секція LynxAI */}
        <div
          className="space-y-4 rounded-xl border p-5 shadow-sm dark:bg-white/[0.05]"
          style={{ borderColor: "#7C1DF2" }}
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
            <h2
              className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
              style={{ color: "#a55dff" }}
            >
              ✨ Аналітика LynxAI
            </h2>
            {lead.ai_scoreExpand !== null && (
              <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-bold shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <span className="text-gray-400">Score:</span>
                <span style={{ color: "#a55dff" }}>
                  {lead.ai_scoreExpand}/100
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="block text-xs text-gray-400 dark:text-gray-500">
                Температура клієнта (Warmth)
              </span>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(lead.warmth || 1) * 20}%`,
                      backgroundColor: "#7C1DF2",
                    }}
                  />
                </div>
                <span className="text-xs font-bold">{lead.warmth || 0}/100</span>
              </div>
            </div>

            <div>
              <span className="mb-1 block text-xs text-gray-400 dark:text-gray-500">
                ШІ-Самарі розмови:
              </span>
              <div className="rounded-lg border border-gray-200 bg-white/80 p-3 text-xs leading-relaxed text-gray-700 shadow-inner dark:border-gray-800 dark:bg-gray-950/80 dark:text-gray-300">
                {lead.ai_summaryExpand ||
                  "Штучний інтелект ще не сформував резюме по цьому ліду."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
