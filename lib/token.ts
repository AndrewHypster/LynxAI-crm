"use server"

import jwt from "jsonwebtoken"
import { authOptions } from "./auth"
import { getServerSession } from "next-auth"

interface TokenPayload {
  userId: string
  role: string
  companyId: number
  exp?: string
}

export async function generateUserApiToken({ userId, role, companyId = 1, exp = '1h' }: TokenPayload): Promise<string> {
  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n")
  
  if (!privateKey) throw new Error("Missing PRIVATE_KEY")

  return jwt.sign(
    {
      sub: 'creator',
      id: +userId,
      role: role.toLowerCase(),
      companyId: +companyId,
    },
    privateKey,
    { 
      algorithm: "RS256", 
      expiresIn: "1h" 
    }
  )
}

export async function generateTokenClient(exp:string): Promise<string> {
  const session = await getServerSession(authOptions) // Обов'язково передавай authOptions
  const user = session?.user

  return await generateUserApiToken({ userId: user?.id as string, role: user?.role as string, companyId: parseInt(user?.companyId || '0') })
}

export async function getValidApiToken(): Promise<string> {
  const session = await getServerSession(authOptions) // Обов'язково передавай authOptions
  const apiToken = session?.user?.apiToken
console.log(apiToken);

  if (!apiToken) {
     return await generateUserApiToken({ userId:session?.user.id as string, role:session?.user.role as string, companyId: parseInt(session?.user.companyId || '0') })
  }
  
  // NextAuth сам викликав ротацію, якщо час піджимав. Токен тут 100% свіжий.
  return apiToken
}