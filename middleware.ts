import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    const role = token?.role

    // Якщо залогінений юзер без ролі намагається зайти в адмін-панель
    if (path.startsWith("/creator") && role !== "CREATOR") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (path.startsWith("/admin") && role !== "ADMIN" && role !== "CREATOR") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  },
  {
    callbacks: {
      // Якщо повертає false, автоматично кидає на pages.signIn
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    // Додай сюди /api/v1/login
    "/((?!api/auth|api/v1/login|forgot-password|_next/static|_next/image|favicon.ico|humans.txt).*)",
  ],
}