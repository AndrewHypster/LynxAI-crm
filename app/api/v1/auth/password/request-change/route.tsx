import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json(); // Отримуємо дані з тіла
  
  if (!username) {
    return new Response(JSON.stringify({ message: "Username required" }), { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.EXTERNAL_API_URL}/auth/password/request-change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json()
    

    if (!response.ok) {
      // Якщо сервер поверне помилку (наприклад, 404 або 400)
      return NextResponse.json(
        {
          success: false,
          message: data.message,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error api/v1/auth/password/request-change', error);
    
  }
  
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}