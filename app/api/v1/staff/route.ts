import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

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

export async function GET(req: NextRequest) {
  try {
    // Дістаємо токен авторизації
    const session = await getToken({ req })
    if (!session)
      return NextResponse.json({ error: "Session is empty" }, { status: 403 })
    const token = session.apiToken

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
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Вимикаємо кешування, щоб дані завжди були актуальні
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          success: false,
          error:
            errorData.error ||
            errorData.message ||
            "Не вдалося завантажити список персоналу",
        },
        { status: response.status }
      )
    }

    const data: StaffMember[] = await response.json()

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("GET_STAFF_API_ERROR:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Внутрішня помилка сервера при отриманні персоналу",
      },
      { status: 500 }
    )
  }
}

// Додай цей інтерфейс до існуючих
interface CreateStaffPayload {
  username: string
  name: string
  phone: string
  telegram_id: number
  telegram_username: string
  role: string
  company_id: number
  permissions: string
  password?: string
}

export async function POST(req: NextRequest) {
  try {
    // Дістаємо токен авторизації з кук
    const session = await getToken({ req })
    if (!session)
      return NextResponse.json({ error: "Session is empty" }, { status: 403 })
    const token = session.apiToken

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Сесія закінчилася. Авторизуйтесь знову" },
        { status: 401 }
      )
    }

    const body: CreateStaffPayload = await req.json()

    // Базова перевірка на обов'язкові поля перед відправкою
    if (!body.username || !body.name || !body.role) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (username, name, role)",
        },
        { status: 400 }
      )
    }

    // Переконуємось, що числові поля відправляються як numbers
    if (body.telegram_id) body.telegram_id = Number(body.telegram_id)
    if (body.company_id) body.company_id = Number(body.company_id)

    // Запит до реального бекенду
    const response = await fetch(`${process.env.EXTERNAL_API_URL}/staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          success: false,
          error:
            errorData.error ||
            errorData.message ||
            "Не вдалося створити співробітника",
        },
        { status: response.status }
      )
    }

    const data = await response.json().catch(() => ({}))

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("POST_STAFF_API_ERROR:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Внутрішня помилка сервера при створенні співробітника",
      },
      { status: 500 }
    )
  }
}
