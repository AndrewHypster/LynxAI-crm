"use server"

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

export async function verifyTelegramBotAction(token: string) {
  const cleanToken = token.trim()

  if (!cleanToken) {
    return { success: false, error: "Токен не може бути порожнім" }
  }

  // Швидка перевірка формату перед запитом
  const tgTokenRegex = /^[0-9]+:[a-zA-Z0-9_-]{35,}$/
  if (!tgTokenRegex.test(cleanToken)) {
    return { success: false, error: "Некоректний формат токена" }
  }

  try {
    // Запит до офіційного API Telegram
    const response = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`, {
      method: "GET",
      cache: "no-store", // Обов'язково для динамічних запитів у Next.js
    })

    const data: TelegramGetMeResponse = await response.json()

    if (!response.ok || !data.ok) {
      return { 
        success: false, 
        error: data.description || "Telegram відхилив цей токен" 
      }
    }

    if (!data.result) {
      return { success: false, error: "Telegram повернув порожню відповідь" }
    }

    // Повертаємо реальні дані бота
    return {
      success: true,
      bot: {
        id: data.result.id.toString(),
        username: data.result.username,
        firstName: data.result.first_name
      }
    }

  } catch (error) {
    console.error("TELEGRAM_API_ERROR:", error)
    return { success: false, error: "Помилка мережі при запиті до Telegram" }
  }
}