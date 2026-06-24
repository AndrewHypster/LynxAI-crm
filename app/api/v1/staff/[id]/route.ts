import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getToken({ req })
  if (!session)
    return NextResponse.json({ error: "Session is empty" }, { status: 403 })
  const token = session.apiToken
  
  const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "Missing staff ID" }, { status: 400 })
  }

  const targetUrl = `${EXTERNAL_API_URL}/staff/${id}`

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
    console.error(`Error in GET /api/v1/staff/${id}:`, error)
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
