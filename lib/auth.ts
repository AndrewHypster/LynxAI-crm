import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt from "jsonwebtoken"
import { generateUserApiToken, getValidApiToken } from "./token"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let userMock = null

  if (credentials?.email === "creator@lynx.com") {
    userMock = {
      id: "1",
      name: "Creator",
      email: "creator@lynx.com",
      role: "CREATOR",
      companyId: null,
    }
  } else if (credentials?.email === "admin@lynx.com") {
    userMock = {
      id: "2", // Унікальний ID для тестів
      name: "Admin",
      email: "admin@lynx.com",
      role: "ADMIN",
      companyId: "UIDtw4w46w4yywsy",
    }
  } else if (credentials?.email === "manager@lynx.com") {
    userMock = {
      id: "3", // Унікальний ID для тестів
      name: "Manager",
      email: "manager@lynx.com",
      role: "MANAGER",
      companyId: "UIDtw4w46w4yywsy",
    }
  }

  if (!userMock) return null

  // Динамічно беремо дані з об'єкта, без хардкоду та рядків 'null'
  return {
    ...userMock,
    apiToken: generateUserApiToken({
      userId: userMock.id,
      role: userMock.role,
      companyId: userMock.companyId as string, // Передасть або null, або реальний ID компанії
    }), // ⚠️ Якщо функція асинхронна (async/Promise), додай сюди await
  }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const currentTime = Date.now()
      const TOKEN_LIFETIME_MS = 60 * 60 * 1000 // 1 година
  
      // 1. Первинний логін (викликається ОДИН раз при вході)
      if (user) {
        token.id = user.id
        token.role = user.role
        token.companyId = user.companyId
        token.apiToken = user.apiToken // 👈 Просто забираємо вже готовий токен з authorize
        token.apiTokenExpiresAt = currentTime + TOKEN_LIFETIME_MS
        return token
      }
  
      // 2. Наступні запити (Ротація токена, коли user вже undefined)
      const expiresAt = token.apiTokenExpiresAt || 0
  
      // Якщо до кінця життя токена лишилося менше 5сек — оновлюємо
      if (currentTime > expiresAt - 5000) {
        console.log(`🔄 API Токен для юзера ${token.id} застарів. Авто-перевипуск...`)
        
        try {
          // Обов'язково передаємо дані з токена куки в генератор!
          token.apiToken = await generateUserApiToken({
            userId: token.id,
            role: token.role,
            companyId: token.companyId as string,
          }) // Якщо функція асинхронна, додай попереду await
          
          token.apiTokenExpiresAt = currentTime + TOKEN_LIFETIME_MS
        } catch (error) {
          console.error("Помилка перевипуску токена:", error)
          return { ...token, error: "RefreshAccessTokenError" }
        }
      }
  
      return token
    },
  
    async session({ session, token }) {
      // Безпечно прокидаємо дані з JWT-куки в об'єкт сесії фронтенду
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.companyId = token.companyId
        session.user.apiToken = token.apiToken
        session.user.apiTokenExpiresAt = token.apiTokenExpiresAt
        
        if (token.error) {
          session.error = token.error
        }
      }
      return session
    },
  },
}
