"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [timer, setTimer] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Таймер для кнопки отримання коду
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleSendCode = async () => {
    if (!username) return toast.error("Введіть юзернейм")
    
    setIsLoading(true)
    try {
      // API запит: надсилаємо username, сервер шле код в ТГ
      const res = await fetch(`${process.env.EXTERNAL_API_URL}/auth/password/request-change`, {
        method: "POST",
        body: JSON.stringify({ username }),
      })
      
      
      if (!res.ok) throw new Error("Не вдалося надіслати код")
     
      
      toast.success("Код надіслано в Telegram")
      setTimer(30)
    } catch (e) {
      toast.error("Помилка відправки коду")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валідація
    if (password !== confirmPassword) {
      return toast.error("Паролі не збігаються")
    }
    if (password.length < 6) {
      return toast.error("Пароль занадто короткий")
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.EXTERNAL_API_URL}/auth/password/confirm`, {
        method: "POST",
        body: JSON.stringify({ username, code, password }),
      })

      if (!res.ok) throw new Error("Невірний код або помилка сервера")

      toast.success("Пароль успішно змінено!")
      router.push("/login")
    } catch (e) {
      toast.error("Помилка при зміні пароля")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-10">
      <h1 className="text-2xl font-bold">Відновлення пароля</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Юзернейм</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Код підтвердження</Label>
          <div className="flex gap-2">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" required />
            <Button type="button" onClick={handleSendCode} disabled={timer > 0 || isLoading}>
              {timer > 0 ? `${timer}с` : "Отримати код"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Новий пароль</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Підтвердіть пароль</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          Змінити пароль
        </Button>
      </form>
    </div>
  )
}