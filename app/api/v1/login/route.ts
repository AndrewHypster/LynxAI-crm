import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;
    console.log('login');
    

    // Тут ти робиш запит до свого реального бекенду, 
    // який повертає JWT токен
    const response = await fetch(`${process.env.EXTERNAL_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
console.log(response);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Невірні дані" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Повертаємо JWT токен клієнту
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}