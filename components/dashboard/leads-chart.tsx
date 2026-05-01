"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"


const DATA_ROLES = [
  { name: "Покупець", value: 89, color: "#10b981" }, // Зелений
  { name: "Ріелтор", value: 24, color: "#3b82f6" }, // Синій
  { name: "Невизначено", value: 11, color: "#f59e0b" }, // Жовтий
]

export function LeadsChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Співвідношення ролей</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA_ROLES}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {DATA_ROLES.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
