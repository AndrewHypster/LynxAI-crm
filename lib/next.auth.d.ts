import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    error?: string
    user: {
      id: string
      role: string
      companyId: string | null
      apiToken: string
      apiTokenExpiresAt: number
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    companyId: string | null
    apiToken: string // 👈 Обов'язково тут, щоб authorize не сварився
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    companyId: string | null
    apiToken: string
    apiTokenExpiresAt: number
    error?: string
  }
}