"use client"

import { signOut, useSession } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NAV_CONFIG } from "@/config/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Building2, ChevronsUpDown, LogOut, Plus, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Company } from "@/lib/constants"

const mockCompanies = [
  { id: "1", name: "ТОВ Рога і Копита", plan: "Enterprise" },
  { id: "2", name: "КиївБуд Девелопмент", plan: "Startup" },
  { id: "3", name: "Borshchiv Digital", plan: "Free" },
]

export function AppSidebar() {
  const { data: session, status } = useSession()
  const [companies, setCompanies] = useState<Company[]>([])
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)

  const user = session?.user
  const currentUserRole = user?.role

  const getCompanies = async () => {
    try {
      const res = await fetch(`/api/v1/companies`)
      if (!res.ok) return

      const data: Company[] = await res.json() // 👈 Змінено назву, щоб не було конфлікту зі стейтом
      
      setCompanies(data)
      
      if (data && data.length > 0) {
        setActiveCompany(data[0]) // Захист від упаду, якщо масив порожній
      }
    } catch (error) {
      console.error("Помилка завантаження компаній:", error)
    }
  }

  useEffect(() => {
    if(currentUserRole == "ADMIN") getCompanies()
  }, [currentUserRole])

   useEffect(() => {
     console.log(
       `%cDEV TEAM %c👇\n%c${window.location.origin}/humans.txt`,
       // Стиль для тексту "Команда розробників"
       "color: #cbd5e1; font-size: 24px; font-weight: bold; font-family: monospace;",
       "font-size: 18px",
       // Стиль для клікабельного лінка
       "color: #7C1DF2; font-size: 14px; font-weight: bold; text-decoration: none; font-family: monospace;"
     )
   }, [])

  // 1. Якщо сесія ще вантажиться, не показуємо дефолтне меню
  if (status === "loading") {
    return (
      <Sidebar collapsible="icon" className="z-[101]">
        <SidebarContent>
        </SidebarContent>
      </Sidebar>
    )
  }

  const userRole = session?.user?.role || "MANAGER" // Дефолтна роль для безпеки

  if (!user) return null
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="z-[101]">
        <SidebarMenu>
          <SidebarMenuItem>
            {currentUserRole === "ADMIN" && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {/* Іконка компанії / Лого */}
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Building2 className="size-4" />
                  </div>
                  {/* Назва поточної компанії */}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{activeCompany? activeCompany.name : 'Loading...'}</span>
                    <span className="truncate text-xs text-muted-foreground">{activeCompany? activeCompany.name : 'Loading...'}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              
              {/* Випадаючий список з кастомним скролом, якщо компаній багато */}
              <DropdownMenuPortal>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border bg-popover text-popover-foreground shadow-md z-[100]"
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
                Компанії
              </DropdownMenuLabel>
    
              {/* Обгортка для скролу з адаптивним скролбаром */}
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                {companies.map((company) => (
                  <DropdownMenuItem
                    key={company.id}
                    onClick={() => setActiveCompany(company)}
                    className="gap-2 p-2 cursor-pointer rounded-sm data-[focused]:bg-accent data-[focused]:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    {/* Квадратик з ініціалами */}
                    <div className="flex size-6 items-center justify-center rounded-sm border border-border bg-muted text-[10px] font-medium text-muted-foreground">
                      {company.name.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <span className="truncate flex-1 text-sm">{company.name}</span>
                    
                    {activeCompany?.id === company.id && (
                      <span className="text-primary text-xs font-bold">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
              
              <DropdownMenuSeparator className="bg-border my-1" />
    
              {/* Фіксована кнопка дії внизу */}
              <DropdownMenuItem className="gap-2 p-2 cursor-pointer text-muted-foreground focus:bg-accent focus:text-accent-foreground rounded-sm">
                <div className="flex size-6 items-center justify-center rounded-md border border-dashed border-border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-xs">Додати компанію</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>}
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>

  <SidebarContent>
    {NAV_CONFIG.map((group) => {
      // Фільтруємо пункти всередині групи
      const allowedItems = group.items.filter((item) =>
        item.roles.includes(userRole)
      )

      // Якщо в групі немає дозволених пунктів — не рендеримо її взагалі
      if (allowedItems.length === 0) return null

      return (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {allowedItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )
    })}
  </SidebarContent>

  <SidebarFooter>
    <SidebarMenu>
      {session && (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user?.name || "Користувач"}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user?.role || "Role"}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="z-[101] w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg z-[100]"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 size-4" />
                Вийти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>
  )
}
