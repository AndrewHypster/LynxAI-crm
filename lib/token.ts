import jwt from "jsonwebtoken"

// Розширюємо глобальний об'єкт для TypeScript, щоб він не сварився
declare global {
  var _cachedApiToken: string | undefined
  var _apiTokenExpiresAt: number | undefined
}

export function getValidApiToken(): string {
  const currentTime = Date.now()

  // Беремо значення з глобального сховища Node.js
  const cachedToken = global._cachedApiToken
  const tokenExpiresAt = global._apiTokenExpiresAt || 0

  // Якщо токен живий — повертаємо його
  if (cachedToken && tokenExpiresAt - currentTime > 30000) {
    return cachedToken
  }

  console.log("🔄 Глобальний кеш порожній/застарів. Генерую новий RS256...")

  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (!privateKey) throw new Error("Missing PRIVATE_KEY")

  const expiresInSeconds = 3600 // 1 година

  const newToken = jwt.sign(
    {
      sub: "user",
      role: "full_access",
      iat: Math.floor(currentTime / 1000),
      exp: Math.floor(currentTime / 1000) + expiresInSeconds,
    },
    privateKey,
    {
      algorithm: "RS256",
      header: {
        alg: "RS256",
        typ: "JWT",
      },
    }
  )

  global._cachedApiToken = newToken
  global._apiTokenExpiresAt = currentTime + expiresInSeconds * 1000

  return newToken
}
