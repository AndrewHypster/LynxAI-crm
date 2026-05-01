import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole
      companyId?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    companyId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    companyId?: string | null
  }
}
