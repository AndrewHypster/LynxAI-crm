"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false, // щоб самому обробити успіх/помилку
    });
  
    if (res?.error) {
      setError("Невірний логін або пароль");
    } else {
      toast.success("Ви успішно увійшли!", {
        description: "Вітаємо у системі",
        duration: 3000,
      });

      // Невелика затримка для UX, щоб юзер побачив тост
      router.push("/");
      router.refresh(); // Оновити стан сесії
    }}

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto p-8 border rounded-xl shadow-sm bg-card">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Авторизація</h1>
        <p className="text-sm text-muted-foreground">Введіть свої дані для входу</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="/forgot-password" className="text-xs text-primary hover:underline underline-offset-4">
              Забули пароль?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Завантаження..." : "Увійти"}
      </Button>
    </form>
  );
}