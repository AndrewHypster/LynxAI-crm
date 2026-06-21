// lib/token.ts
import jwt from "jsonwebtoken"
import { authOptions } from "./auth"
import { getServerSession } from "next-auth"

interface TokenPayload {
  userId: string
  role: string
  companyId: string
}

export function generateUserApiToken({ userId, role, companyId }: TokenPayload): string {
  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (!privateKey) throw new Error("Missing PRIVATE_KEY")

  return jwt.sign(
    {
      role: role.toLowerCase(),
      // companyId: companyId,
    },
    privateKey,
    { 
      algorithm: "RS256", 
      expiresIn: "1h" 
    }
  )
}

export async function getValidApiToken(): Promise<string> {
  const session = await getServerSession(authOptions) // Обов'язково передавай authOptions
  const apiToken = session?.user?.apiToken

  if (!apiToken) {
     return generateUserApiToken({ userId:session?.user.id as string, role:session?.user.role as string, companyId: session?.user.companyId as string })
  }
  console.log(apiToken);
  
  // NextAuth сам викликав ротацію, якщо час піджимав. Токен тут 100% свіжий.
  return apiToken
}