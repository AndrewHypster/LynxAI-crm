import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
        // Тут логіка перевірки з БД (Prisma)
        // Наразі повертаємо мок-об'єкт:
        if (credentials?.email === "creator@lynx.com") {
          return {
            id: "1",
            name: "Creator",
            email: "creator@lynx.com",
            role: "CREATOR",
            companyId: null,
          }
        } else if (credentials?.email === "admin@lynx.com") {
          return {
            id: "1",
            name: "Admin",
            email: "admin@lynx.com",
            role: "ADMIN",
            companyId: "UIDtw4w46w4yywsy",
          }
        } else if (credentials?.email === "manager@lynx.com") {
          return {
            id: "1",
            name: "Manager",
            email: "manager@lynx.com",
            role: "MANAGER",
            companyId: "UIDtw4w46w4yywsy",
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.companyId = token.companyId
      }
      return session
    },
  },
}
