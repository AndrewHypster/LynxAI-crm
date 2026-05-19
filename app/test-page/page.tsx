"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button" // Або твій шлях до базової кнопки

const ALLOWED_PATCH_FIELDS = [
  "status",
  "comment",
  "full_name",
  "phone",
  "phone_normalized",
  "role",
  "stage",
  "contact_status",
  "priority",
  "stage_719",
  "readiness_for_selection",
  "main_request",
  "interest_reason",
  "manager_id",
]

export default function TestPatchPage() {
  const [leadId, setLeadId] = useState("")
  const [selectedField, setSelectedField] = useState(ALLOWED_PATCH_FIELDS[0])
  const [fieldValue, setFieldValue] = useState("")

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTestPatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leadId.trim()) {
      setError("Введи ID ліда")
      return
    }

    setLoading(true)
    setResponse(null)
    setError(null)

    try {
      // Формуємо динамічне тіло запиту: { [status]: "value" }
      const requestBody = {
        [selectedField]: fieldValue,
      }

      const res = await fetch(`/api/v1/leads/${leadId.trim()}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Помилка сервера: ${res.status}`)
      }

      setResponse(data)
    } catch (err: any) {
      setError(err.message || "Щось пішло не так")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 transition-colors duration-200 dark:bg-gray-950">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/[0.08] dark:bg-white/[0.04] dark:backdrop-blur-md">
        <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          🧪 Тестування PATCH API /leads/[id]
        </h1>

        <form onSubmit={handleTestPatch} className="space-y-4">
          {/* Input ID */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              ID Ліда
            </label>
            <input
              type="text"
              placeholder="1307"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#7C1DF2] focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-white"
            />
          </div>

          {/* Select Field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Поле для оновлення
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#7C1DF2] focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-white"
            >
              {ALLOWED_PATCH_FIELDS.map((field) => (
                <option key={field} value={field} className="dark:bg-gray-900">
                  {field}
                </option>
              ))}
            </select>
          </div>

          {/* Input Value */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Нове значення
            </label>
            <input
              type="text"
              placeholder="Введи нове значення поля"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#7C1DF2] focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-white"
            />
          </div>

          {/* Кнопка відправки */}
          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full font-medium text-white shadow-sm transition-all"
            style={{ backgroundColor: "#7C1DF2" }}
          >
            {loading ? "Надсилання..." : "Відправити PATCH запит"}
          </Button>
        </form>

        {/* Логи результатів */}
        {(response || error) && (
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-white/[0.08]">
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Результат запиту:
            </h3>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                ❌ {error}
              </div>
            )}

            {response && (
              <pre className="max-h-60 overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-3 font-mono text-xs text-green-400">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
