import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoveLeft, LayoutDashboard } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <div className="relative">
        {/* Головний текст з ефектом глітчу */}
        <h1 className="relative z-10 text-[12rem] leading-none font-black tracking-tighter text-foreground sm:text-[18rem] dark:text-white">
          <span className="relative z-10">404</span>

          <span className="absolute top-0 left-0 -z-10 animate-glitch-1 text-red-500 opacity-70">
            404
          </span>
          {/* Синій шар ще глибше */}
          <span className="absolute top-0 left-0 -z-20 animate-glitch-2 text-cyan-500 opacity-70">
            404
          </span>
        </h1>
      </div>

      <div className="z-20 -mt-8 flex flex-col items-center gap-6 px-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-[0.2em] uppercase">
            System.DataNotFoundException
          </h2>
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
        </div>
      </div>

      {/* Фоновий декор: сітка */}
      <div className="absolute -z-10 inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:40px_40px]" />
    </div>
  )
}
