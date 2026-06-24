import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getToken({req});
  if (!session) return NextResponse.json({ error: "Session is empty" }, { status: 403 })
  
  const token = session.apiToken

  try {
    // Швидко бере закешований токен (або оновлює його, якщо пройшла година)

    const res = await fetch(`${process.env.EXTERNAL_API_URL}/companies`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok)
      return NextResponse.json({ error: "API Error" }, { status: res.status })

    return NextResponse.json(await res.json())
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
