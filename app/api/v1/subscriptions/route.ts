import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  const session = await getToken({ req })
  if (!session)
    return NextResponse.json({ error: "Session is empty" }, { status: 403 })
  const token = session.apiToken

  const resp = await fetch(`${process.env.EXTERNAL_API_URL}/subscriptions`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await resp.json()

  if(!resp.ok) return NextResponse.json(
    {
      success: false,
      message: data.message,
    },
    { status: resp.status }
  )

  return NextResponse.json(
    {
      success: true,
      message: data.message,
      data: resp
    },
    { status: resp.status }
  )
}