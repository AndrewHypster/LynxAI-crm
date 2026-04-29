export const STATUS_CONFIG = {
  NEW: {
    label: "Новий",
    color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    dot: "bg-blue-500",
  },
  ACTIVE: {
    label: "Активний",
    color:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Завершено",
    color:
      "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
    dot: "bg-orange-500",
  },
  BANNED: {
    label: "Заблоковано",
    color: "bg-destructive/15 text-destructive border-destructive/30",
    dot: "bg-destructive",
  },
} as const

export const ROLE_CONFIG = {
  ADMIN: {
    label: "Адміністратор",
    color: "text-destructive",
    iconColor: "text-destructive",
  },
  MANAGER: {
    label: "Менеджер",
    color: "text-primary",
    iconColor: "text-primary",
  },
  USER: {
    label: "Користувач",
    color: "text-muted-foreground",
    iconColor: "text-muted-foreground/70",
  },
} as const
