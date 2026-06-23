import { getValidApiToken } from "@/lib/token"
import { NextResponse } from "next/server"

interface UpdateUserPayload {
    role?: string
    full_name?: string
  }
  
  export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Асинхронні params для Next.js 15+
  ) {
    try {
      const { id } = await params
      const userId = parseInt(id, 10) 
  
      if (isNaN(userId)) {
        return NextResponse.json(
          { success: false, error: "Некоректний ID користувача (має бути числовим)" },
          { status: 400 }
        )
      }
  
      const body: UpdateUserPayload = await request.json()
  
      // Перевірка на пустий боді
      if (!body.role && !body.full_name) {
        return NextResponse.json(
          { success: false, error: "Немає даних для оновлення" },
          { status: 400 }
        )
      }
  
      // Дістаємо JWT токен з безпечних кук
      const token = await getValidApiToken()
  
      if (!token) {
        return NextResponse.json(
          { success: false, error: "Сесія закінчилася. Авторизуйтесь знову" },
          { status: 401 }
        )
      }
  
      // Шлемо PATCH запит на реальний бекенд
      const response = await fetch(`${process.env.EXTERNAL_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
        cache: "no-store"
      })
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          { success: false, error: errorData.message || "Не вдалося оновити дані користувача" },
          { status: response.status }
        )
      }
  
      const data = await response.json().catch(() => ({}))
  
      return NextResponse.json({
        success: true,
        data
      })
  
    } catch (error) {
      console.error("PATCH_USER_API_ERROR:", error)
      return NextResponse.json(
        { success: false, error: "Помилка сервера при оновленні користувача" },
        { status: 500 }
      )
    }
  }