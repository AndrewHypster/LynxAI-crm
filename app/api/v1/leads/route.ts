import { NextRequest, NextResponse } from "next/server"
import { useSession } from "next-auth/react"
import { getValidApiToken } from "@/lib/token"

export async function GET(request: NextRequest) {
  const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
  const { searchParams } = new URL(request.url)
  const queryString = searchParams.toString()

  const targetUrl = queryString
    ? `${EXTERNAL_API_URL}/leads?${queryString}`
    : `${EXTERNAL_API_URL}/leads`

    const token = await getValidApiToken()

    try {
      const res = await fetch(targetUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })

    if (!res.ok)
      return NextResponse.json({ error: "API Error" }, { status: res.status })

    return NextResponse.json(await res.json())
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}



interface LeadRequestBody {
  first_name: string
  last_name: string
  middle_name?: string
  phone: string
  title: string
  lead_type?: string
  client_type?: string
  purchase_type?: string
  budget?: string
  rooms?: string
  district?: string
  description?: string
  comment?: string
  source?: string
  source_details?: string
  status?: string
  state?: string
  assigned_to?: number
  buyer?: number
  arendator?: number
  objects_ids?: number[]
  next_action_text?: string
  next_step_at?: string
  next_action_due_at?: string
  last_action_at?: string
}

export async function POST(request: Request) {
  try {
    const body: LeadRequestBody = await request.json()

    // 1. Валідація
    if (!body.first_name || !body.last_name || !body.phone || !body.title) {
      return NextResponse.json(
        { success: false, message: "Відсутні обов'язкові поля" },
        { status: 400 }
      )
    }

    // 2. Формування чистого корисного навантаження
    const payload = {
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      middle_name: body.middle_name?.trim() || "",
      phone: body.phone.trim(),
      title: body.title.trim(),
      lead_type: body.lead_type || "buyer",
      client_type: body.client_type || "INDIVIDUAL",
      purchase_type: body.purchase_type || "APARTMENT",
      budget: body.budget || "",
      rooms: body.rooms || "",
      district: body.district || "",
      description: body.description || "",
      comment: body.comment || "",
      source: body.source || "TELEGRAM",
      source_details: body.source_details || "",
      status: body.status || "new",
      state: body.state || "ACTIVE",
      assigned_to: Number(body.assigned_to) || 0,
      buyer: Number(body.buyer) || 0,
      arendator: Number(body.arendator) || 0,
      objects_ids: Array.isArray(body.objects_ids) ? body.objects_ids : [],
      next_action_text: body.next_action_text || "",
      next_step_at: body.next_step_at || new Date().toISOString(),
      next_action_due_at: body.next_action_due_at || new Date().toISOString(),
      last_action_at: body.last_action_at || new Date().toISOString(),
    }

    // 3. ЗАПИТ НА ГОЛОВНИЙ СЕРВЕР
    // Заміни URL на адресу свого головного сервера (краще винести в .env як BACKEND_URL)
 
    const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
    
    const response = await fetch(`${EXTERNAL_API_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${await getValidApiToken()}`
      },
      body: JSON.stringify(payload),
    })

    // Якщо головний сервер ліг або повернув помилку (4xx, 5xx)
    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          success: false, 
          message: errorResponse.message || "Головний сервер повернув помилку",
          errors: errorResponse.errors || null
        }, 
        { status: response.status }
      )
    }

    // Отримуємо дані, які повернув головний сервер (наприклад, ID створеного ліда)
    const serverData = await response.json()

    return NextResponse.json(
      { 
        success: true, 
        message: "Лід успішно створений на головному сервері", 
        data: serverData 
      }, 
      { status: 201 }
    )

  } catch (error) {
    console.error("API_LEADS_POST_ERROR:", error)
    return NextResponse.json(
      { success: false, message: "Не вдалося зв'язатися з головним сервером" }, 
      { status: 500 }
    )
  }
}