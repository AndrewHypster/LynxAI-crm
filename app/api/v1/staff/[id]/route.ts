import { NextRequest, NextResponse } from "next/server"
import { getValidApiToken } from "@/lib/token"
import { getServerSession } from "next-auth"
import { LEAD_ALLOWED_PATCH_FIELDS } from "@/lib/constants"

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL

  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "Missing staff ID" }, { status: 400 })
  }

  const targetUrl = `${EXTERNAL_API_URL}/staff/${id}`

  try {
    const token = await getValidApiToken()

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

