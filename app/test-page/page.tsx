'use client'

import { Button } from "@/components/ui/button"

export default function UsersTable() {

  const db = async (page = 1, limit = 10) => {
    console.log('db ...');
    
    try {
      // Стукаємо на твій локальний API шлях
      const response = await fetch(`/api/v1/leads?page=${page}&limit=${limit}`)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error("Помилка завантаження лідів:", error)
    } finally {
    }
  }

  return <Button onClick={() => db(1,10)}>Дістати лідів</Button>
}
