import { NextResponse } from "next/server"

interface TelegramGetMeResponse {
  ok: boolean
  description?: string
  result?: {
    id: number
    is_bot: boolean
    first_name: string
    username: string
    can_join_groups: boolean
    can_read_all_group_messages: boolean
    supports_inline_queries: boolean
  }
}

export async function POST(request: Request) {
  try {
    // Парсимо body запиту
    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== "string" || !token.trim()) {
      return NextResponse.json(
        { success: false, error: "Токен не може бути порожнім" },
        { status: 400 }
      )
    }

    const cleanToken = token.trim()

    // Швидка перевірка формату
    const tgTokenRegex = /^[0-9]+:[a-zA-Z0-9_-]{35,}$/
    if (!tgTokenRegex.test(cleanToken)) {
      return NextResponse.json(
        { success: false, error: "Некоректний формат токена" },
        { status: 400 }
      )
    }

    // Запит до Telegram API
    const response = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`, {
      method: "GET",
      cache: "no-store",
    })

    const data: TelegramGetMeResponse = await response.json()

    if (!response.ok || !data.ok) {
      return NextResponse.json(
        { success: false, error: data.description || "Telegram відхилив цей токен" },
        { status: response.status === 401 ? 401 : 400 }
      )
    }

    if (!data.result) {
      return NextResponse.json(
        { success: false, error: "Telegram повернув порожню відповідь" },
        { status: 500 }
      )
    }

    // Успішна відповідь
    return NextResponse.json({
      success: true,
      bot: {
        id: data.result.id.toString(),
        username: data.result.username,
        firstName: data.result.first_name
      }
    })

  } catch (error) {
    console.error("TELEGRAM_API_ROUTE_ERROR:", error)
    return NextResponse.json(
      { success: false, error: "Помилка сервера або мережі при запиті до Telegram" },
      { status: 500 }
    )
  }
}