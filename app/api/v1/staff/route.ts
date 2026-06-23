import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getValidApiToken } from "@/lib/token"

// Інтерфейс для типізації об'єкта staff відповідно до схеми бекенду
interface StaffMember {
  id: number
  username: string
  name: string
  phone: string
  telegram_id: number
  telegram_username: string
  role: string
  company_id: number
  permissions: string
  created_at: string
  is_active: boolean
  is_senior: boolean
}

export async function GET() {
  try {
    // Дістаємо токен авторизації
    const cookieStore = await cookies()
    const token = await getValidApiToken()

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Сесія закінчилася. Авторизуйтесь знову" },
        { status: 401 }
      )
    }

    // Запит до реального бекенду (шлях до ендпоінту бекенду міняй, якщо він відрізняється)
    const response = await fetch(`${process.env.EXTERNAL_API_URL}/staff`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store" // Вимикаємо кешування, щоб дані завжди були актуальні
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || errorData.message || "Не вдалося завантажити список персоналу" },
        { status: response.status }
      )
    }

    const data: StaffMember[] = await response.json()

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error("GET_STAFF_API_ERROR:", error)
    return NextResponse.json(
      { success: false, error: "Внутрішня помилка сервера при отриманні персоналу" },
      { status: 500 }
    )
  }
}