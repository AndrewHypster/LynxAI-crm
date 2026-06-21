import { getValidApiToken } from "@/lib/token"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
  const targetUrl = `${EXTERNAL_API_URL}/companies`
  const session = await getServerSession()

  if (!session) return NextResponse.json({ error: "Session is empty" }, { status: 403 })
  const token = await getValidApiToken()

  try {
    // Швидко бере закешований токен (або оновлює його, якщо пройшла година)

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
