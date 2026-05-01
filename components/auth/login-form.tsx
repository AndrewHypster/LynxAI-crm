"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner" // Новий імпорт

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const loginSchema = z.object({
  // email: z.string().email({ message: "Введіть коректний email" }),
  role: z.string().min(1, "Виберіть роль"),
  password: z
    .string()
    .min(6, { message: "Пароль має бути не менше 6 символів" }),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "manager", password: "Wioj%30sg68" },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)

    const result = await signIn("credentials", {
      email: values.role + '@lynx.com',
      password: values.password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      toast.error("Помилка входу", {
        description: "Невірний email або пароль",
      })
    } else {
      toast.success("Успішний вхід", {
        description: "Ласкаво просимо до LynxAI",
      })
      router.push("/")
      router.refresh()
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Вхід</CardTitle>
        <CardDescription>Введіть свою роль</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>creator admin manager</FormLabel>
                  <FormControl>
                    <Input placeholder="creator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      // {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Завантаження..." : "Увійти"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
