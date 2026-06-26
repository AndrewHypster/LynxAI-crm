import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt from "jsonwebtoken"

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
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
      
        const res = await fetch(`${process.env.EXTERNAL_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: credentials.username, 
            password: credentials.password 
          }),
        });
      
        if (!res.ok) return null;
      
        const data = await res.json(); // Отримуємо { access_token, role, ... }
        
        // Декодуємо JWT без перевірки підпису (бо це токен, який нам видав наш же надійний сервер)
        const decoded = jwt.decode(data.access_token) as any;
      
        if (!decoded) return null;
      
        // Повертаємо об'єкт користувача
        return {
          id: decoded.id.toString(), // NextAuth очікує рядок
          name: decoded.sub,
          role: decoded.role,
          companyId: decoded.company_id ? decoded.company_id.toString() : null,
          apiToken: data.access_token, // Зберігаємо токен для подальших запитів
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 1. Первинний логін
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          companyId: user.companyId,
          apiToken: user.apiToken,
          apiTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 година
        };
      }
    
      // 2. Перевірка на прострочення
      const expiresAt = token.apiTokenExpiresAt as number || 0;
      
      if (Date.now() > expiresAt) {
        // Токен закінчився. Закриваєм сесію, клієнта на авторизацію
        return null as any;
      }
    
      return token;
    },

    async session({ session, token }) {
      // Безпечно прокидаємо дані з JWT-куки в об'єкт сесії фронтенду
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.companyId = token.companyId

        if (token.error) {
          session.error = token.error
        }
      }
      return session
    },
  },
}
