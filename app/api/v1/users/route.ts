import { NextRequest, NextResponse } from "next/server"
import { getValidApiToken } from "@/lib/token"

export async function GET(request: NextRequest) {
  const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
  const { searchParams } = new URL(request.url)
  const queryString = searchParams.toString()

  const targetUrl = queryString
    ? `${EXTERNAL_API_URL}/users?${queryString}`
    : `${EXTERNAL_API_URL}/users`

  try {
    // Швидко бере закешований токен (або оновлює його, якщо пройшла година)
    const token = getValidApiToken()

    

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
