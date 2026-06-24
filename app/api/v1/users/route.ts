import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
  const { searchParams } = new URL(req.url)
  const queryString = searchParams.toString()

  const targetUrl = queryString
    ? `${EXTERNAL_API_URL}/users?${queryString}`
    : `${EXTERNAL_API_URL}/users`

  try {
    // Швидко бере закешований токен (або оновлює його, якщо пройшла година)
    const session = await getToken({ req })
    if (!session)
      return NextResponse.json({ error: "Session is empty" }, { status: 403 })
    const token = session.apiToken

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
