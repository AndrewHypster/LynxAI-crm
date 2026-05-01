import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoveLeft, LayoutDashboard } from "lucide-react"

export default function NotFound() {
  return (
    // Використовуємо calc(100vh - 64px) для висоти, де 64px — висота твоєї шапки
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="relative">
        {/* Головний текст з ефектом глітчу */}
        <h1 className="relative text-[12rem] leading-none font-black tracking-tighter text-foreground sm:text-[18rem] dark:text-white">
          <span className="relative z-10">404</span>

          {/* Псевдо-шари для глітчу (червоний та синій відблиски) */}
          <span className="animate-glitch-1 absolute top-0 left-0 -z-10 text-red-500 opacity-70 mix-blend-screen dark:mix-blend-lighten">
            404
          </span>
          <span className="animate-glitch-2 absolute top-0 left-0 -z-20 text-cyan-500 opacity-70 mix-blend-screen dark:mix-blend-lighten">
            404
          </span>
        </h1>
      </div>

      <div className="z-20 -mt-8 flex flex-col items-center gap-6 px-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-[0.2em] uppercase">
            System.DataNotFoundException
          </h2>
          {/* <p className="max-w-[450px] text-muted-foreground">
            Об'єкт не знайдено в поточній матриці. Схоже, LynxAI натрапив на
            битий сектор або сторінка була деінстальована.
          </p> */}
        </div>

        <div className="flex gap-4">
          <Button
            asChild
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
          {/* <Button asChild>
            <Link href="javascript:history.back()">
              <MoveLeft className="mr-2 h-4 w-4" /> Назад
            </Link>
          </Button> */}
        </div>
      </div>

      {/* Фоновий декор: сітка */}
      <div className="absolute inset-0 -z-30 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:40px_40px]" />
    </div>
  )
}
