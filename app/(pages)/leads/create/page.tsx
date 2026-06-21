"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { ChevronLeft, Loader2, Save, User, Building2, MapPin, MessageSquare } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LEAD_ROLE_CONFIG, LEAD_STATUS_CONFIG, PROPERTY_TYPE_CONFIG } from "@/lib/constants"

// Чистий TypeScript тип для форми замість Zod
interface LeadFormValues {
  first_name: string
  last_name: string
  middle_name: string
  phone: string
  title: string
  lead_type: string
  client_type: string
  purchase_type: string
  budget: string
  rooms: string
  district: string
  description: string
  comment: string
  source: string
  source_details: string
  status: string
  state: string
  assigned_to: number
  buyer: number
  arendator: number
  objects_ids: number[]
  next_action_text: string
  next_step_at: string
  next_action_due_at: string
  last_action_at: string
}

export default function CreateLeadPage() {
  const router = useRouter()

  // Ініціалізація форми суто на дефолтних значеннях
  const form = useForm<LeadFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      middle_name: "",
      phone: "",
      title: "",
      lead_type: "BUYER",
      client_type: "INDIVIDUAL",
      purchase_type: "APARTMENT",
      budget: "",
      rooms: "",
      district: "",
      description: "",
      comment: "",
      source: "TELEGRAM",
      source_details: "",
      status: "new",
      state: "ACTIVE",
      assigned_to: 0,
      buyer: 0,
      arendator: 0,
      objects_ids: [],
      next_action_text: "",
      next_step_at: new Date().toISOString(),
      next_action_due_at: new Date().toISOString(),
      last_action_at: new Date().toISOString(),
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: LeadFormValues) {
    try {
      // Ручне перетворення числових полів перед відправкою, оскільки Zod coerce прибрали
      const payload = {
        ...values,
        assigned_to: Number(values.assigned_to) || 0,
        buyer: Number(values.buyer) || 0,
        arendator: Number(values.arendator) || 0,
      }

      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()
      
      toast.success("Успіх! Клієнта створено")
      router.push("/leads")
      router.refresh()
    } catch (error) {
      toast.error("Помилка при збереженні даних ліда")
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Новий запит клієнта</h1>
          <p className="text-muted-foreground text-sm">Створення нової картки в CRM</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Основний блок */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Персональні дані
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="first_name" rules={{ required: "Ім'я обов'язкове" }} render={({ field }) => (
                    <FormItem><FormLabel>Ім'я *</FormLabel><FormControl><Input placeholder="Ім'я" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="last_name" rules={{ required: "Прізвище обов'язкове" }} render={({ field }) => (
                    <FormItem><FormLabel>Прізвище *</FormLabel><FormControl><Input placeholder="Прізвище" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="middle_name" render={({ field }) => (
                    <FormItem><FormLabel>По батькові</FormLabel><FormControl><Input placeholder="По батькові" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" rules={{ required: "Телефон обов'язковий" }} render={({ field }) => (
                    <FormItem><FormLabel>Телефон *</FormLabel><FormControl><Input placeholder="+380" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Параметри нерухомості
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="title" rules={{ required: "Вкажіть заголовок" }} render={({ field }) => (
                    <FormItem><FormLabel>Тема / Заголовок запиту *</FormLabel><FormControl><Input placeholder="Напр: Купівля 2к квартири" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="purchase_type" render={({ field }) => (
                      <FormItem><FormLabel>Тип нерухомості</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {Object.entries(PROPERTY_TYPE_CONFIG).map(([key, config]) => {
                                const Icon = config.icon
                                return (
                                <SelectItem value={key} key={key}>
                                    <span className="flex items-center gap-2">
                                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                                    <span>{config.label}</span>
                                    </span>
                                </SelectItem>
                                )
                            })}
                            </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="budget" render={({ field }) => (
                      <FormItem><FormLabel>Бюджет ($)</FormLabel><FormControl><Input placeholder="70000" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="rooms" render={({ field }) => (
                      <FormItem><FormLabel>Кімнат</FormLabel><FormControl><Input placeholder="2" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="district" render={({ field }) => (
                    <FormItem><FormLabel>Район / Локація</FormLabel><FormControl><Input placeholder="Центр, Поділ..." {...field} /></FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" /> Опис та замітки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Детальний опис</FormLabel><FormControl><Textarea className="min-h-[100px] resize-none" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="comment" render={({ field }) => (
                    <FormItem><FormLabel>Внутрішній коментар</FormLabel><FormControl><Textarea className="min-h-[60px] resize-none" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="next_action_text" render={({ field }) => (
                    <FormItem><FormLabel>Наступна дія</FormLabel><FormControl><Input placeholder="Передзвонити клієнту" {...field} /></FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>

            {/* Бокова панель */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Статус та Джерела
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Статус</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Оберіть статус" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.entries(LEAD_STATUS_CONFIG).map(([key, status]) => (
                            <SelectItem value={key} key={key}>
                              <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                                {status.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="lead_type" render={({ field }) => (
                    <FormItem><FormLabel>Тип ліда</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {Object.entries(LEAD_ROLE_CONFIG).map(([key, config]) => {
                                const Icon = config.icon
                                return (
                                <SelectItem value={key} key={key}>
                                    <span className="flex items-center gap-2">
                                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                                    <span>{config.label}</span>
                                    </span>
                                </SelectItem>
                                )
                            })}
                            </SelectContent>
                        </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="source" render={({ field }) => (
                    <FormItem><FormLabel>Джерело</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="TELEGRAM">Telegram</SelectItem>
                          <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                          <SelectItem value="SITE">Сайт</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="source_details" render={({ field }) => (
                    <FormItem><FormLabel>Деталі джерела</FormLabel><FormControl><Input placeholder="Кампанія / Юзернейм" {...field} /></FormControl></FormItem>
                  )} />

                  <FormField control={form.control} name="assigned_to" render={({ field }) => (
                    <FormItem><FormLabel>ID Відповідального</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Збереження...</> : <><Save className="mr-2 h-5 w-5" /> Створити клієнта</>}
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>Скасувати</Button>
              </div>
            </div>

          </div>
        </form>
      </Form>
    </div>
  )
}