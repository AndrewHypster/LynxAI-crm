import { NextRequest, NextResponse } from "next/server"
import { LEAD_ALLOWED_PATCH_FIELDS } from "@/lib/constants"
import { getToken } from "next-auth/jwt"

type RouteParams = {
  params: Promise<{ lead_id: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getToken({req});
  if (!session) return NextResponse.json({ error: "Session is empty" }, { status: 403 })
  
  const { lead_id } = await params
  if (!lead_id) return NextResponse.json({ error: "Missing lead ID" }, { status: 400 })

  const targetUrl = `${process.env.EXTERNAL_API_URL}/leads/${lead_id}`
  const token = session.apiToken

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `API Error from external server` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error(`Error in GET /api/v1/leads/${lead_id}:`, error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

// ЗМІНИТИ ЗНАЧЕННЯ ЛІДА ЗА ID
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getToken({req});
  if (!session) return NextResponse.json({ error: "Session is empty" }, { status: 403 })
  
  const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
  const { lead_id } = await params
  if (!lead_id) {
    return NextResponse.json({ error: "Missing lead ID" }, { status: 400 })
  }

  try {
    const body = await req.json()
    const filteredBody: Record<string, any> = {}
    let hasValidFields = false

    // Ітеруємося по полях, які прийшли в запиті
    for (const key in body) {
      if (body[key] !== undefined) {
        const config = LEAD_ALLOWED_PATCH_FIELDS[key]

        // 1. Якщо поля немає в нашій схемі — ігноруємо його (Працює як Whitelist)
        if (!config) continue

        const value = body[key]

        // 2. Валідація базових типів (string, number, array)
        if (config.type === "array") {
          if (!Array.isArray(value)) {
            return NextResponse.json(
              { error: `Field '${key}' must be an array` },
              { status: 400 }
            )
          }
        } else if (typeof value !== config.type) {
          return NextResponse.json(
            { error: `Field '${key}' must be a ${config.type}` },
            { status: 400 }
          )
        }

        // 3. Валідація ENUM значень (якщо вони прописані для поля)
        if (config.enum && !config.enum.includes(value)) {
          return NextResponse.json(
            {
              error: `Invalid value for '${key}'. Allowed values: ${config.enum.join(", ")}`,
            },
            { status: 400 }
          )
        }

        // Якщо перевірки пройшли — додаємо в чистий об'єкт
        filteredBody[key] = value
        hasValidFields = true
      }
    }

    if (!hasValidFields) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      )
    }

    // Відправка на зовнішній бекенд
    const targetUrl = `${EXTERNAL_API_URL}/leads/${lead_id}`
    const token = session.apiToken

    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredBody),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || "Failed to update lead" },
        { status: res.status }
      )
    }

    return NextResponse.json(await res.json())
  } catch (error: any) {
    console.error(`Error in PATCH /api/v1/leads/${lead_id}:`, error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
