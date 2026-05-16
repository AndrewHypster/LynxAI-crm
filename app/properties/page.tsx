"use client"

import {
  BaseProperty,
  PROPERTY_STATUS_CONFIG,
  PROPERTY_TYPE_CONFIG,
} from "@/lib/constants"
import { ColumnConfig, UniversalTable } from "@/components/table"
import { BedDouble, KeyRound, Layers, MapPin, Square, Tag } from "lucide-react"
import { useState } from "react"

// 1. Конфіг колонок виносимо за межі компонента, щоб він не перестворювався при кожному рендері
export const userColumns: ColumnConfig<BaseProperty>[] = [
  {
    header: "Об'єкт",
    key: "title",
    type: "custom",
    render: (prop) => (
      <div className="flex flex-col py-1">
        <span className="line-clamp-1 font-bold text-slate-900 dark:text-white">
          {prop.title}
        </span>
        <div className="flex items-center text-xs text-slate-500">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="line-clamp-1">{prop.address}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Тип",
    key: "type",
    type: "badge-icon",
    config: PROPERTY_TYPE_CONFIG, // Твій конфіг з іконками House, Building2 тощо
  },
  {
    header: "Статус",
    key: "status",
    type: "badge-dot",
    config: PROPERTY_STATUS_CONFIG, // Конфіг: AVAILABLE, SOLD, RENTED, RESERVED
  },
  {
    header: "Вартість",
    key: "salePrice",
    type: "custom",
    render: (prop) => (
      <div className="flex flex-col gap-1">
        {prop.salePrice && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Tag className="mr-1 h-3 w-3" />
            <span className="text-sm font-semibold">
              ${prop.salePrice.toLocaleString("en-US")}
            </span>
          </div>
        )}
        {prop.rentPrice && (
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <KeyRound className="mr-1 h-3 w-3" />
            <span className="text-sm font-semibold">
              ${prop.rentPrice.toLocaleString("en-US")}
              <span className="text-[10px] font-normal">/міс</span>
            </span>
          </div>
        )}
        {!prop.salePrice && !prop.rentPrice && (
          <span className="text-xs text-slate-400 italic">Ціну не вказано</span>
        )}
      </div>
    ),
  },
  {
    header: "Параметри",
    key: "area",
    type: "custom",
    render: (prop) => (
      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
        <div className="flex items-center" title="Площа">
          <Square className="mr-1 h-3 w-3" />
          <span className="text-xs">{prop.area} м²</span>
        </div>
        {prop.rooms && (
          <div className="flex items-center" title="Кімнати">
            <BedDouble className="mr-1 h-3 w-3" />
            <span className="text-xs">{prop.rooms}</span>
          </div>
        )}
        {prop.floor && (
          <div className="flex items-center" title="Поверх">
            <Layers className="mr-1 h-3 w-3" />
            <span className="text-xs">{prop.floor}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    header: "Дата",
    key: "createdAt",
    type: "custom",
    render: (prop) => (
      <p className="text-xs text-slate-500">
        {new Date(prop.createdAt).toLocaleDateString("uk-UA")}
      </p>
    ),
  },
]

export default function PropertiesTable() {

  const MOCK_PROPERTIES: BaseProperty[] = [
   {
     id: "prop-001",
     ownerId: "agent-123",
     title: "Сучасна студія в центрі",
     address: "Київ, вул. Хрещатик, 25",
     location: "50.4501, 30.5234",
     type: "APARTMENT",
     status: "AVAILABLE",
     salePrice: 120000,
     rentPrice: 800,
     currency: "USD",
     isForSale: true,
     isForRent: true,
     area: 45,
     rooms: 1,
     floor: 5,
     images: [
       "https://picsum.photos/800/600?random=1",
       "https://picsum.photos/800/600?random=2",
     ],
     description:
       "Світла квартира з панорамними вікнами та дизайнерським ремонтом.",
     benefits: ["WIFI", "ELEVATOR", "AIR_CONDITIONING", "SECURITY"],
     createdAt: "2026-05-10T14:30:00Z",
   },
   {
     id: "prop-002",
     ownerId: "agent-123",
     title: "Котедж біля озера",
     address: "Тернопільська обл., с. Біла",
     location: "49.5632, 25.5901",
     type: "HOUSE",
     status: "RESERVED",
     salePrice: 250000,
     rentPrice: null,
     currency: "USD",
     isForSale: true,
     isForRent: false,
     area: 180,
     rooms: 4,
     images: ["https://picsum.photos/800/600?random=3"],
     description:
       "Двоповерховий будинок з власним виходом до води та великим садом.",
     benefits: ["PARKING", "GARDEN", "SECURITY", "POOL"],
     documents: "https://example.com/docs/house-id-002.pdf",
     createdAt: "2026-05-08T09:00:00Z",
   },
   {
     id: "prop-003",
     ownerId: "agent-456",
     title: "Земельна ділянка під забудову",
     address: "Львівська обл., смт Брюховичі",
     type: "LAND",
     status: "AVAILABLE",
     salePrice: 45000,
     rentPrice: null,
     currency: "USD",
     isForSale: true,
     isForRent: false,
     area: 1200, // 12 соток
     images: ["https://picsum.photos/800/600?random=4"],
     description: "Рівна ділянка, комунікації підведені. Поруч хвойний ліс.",
     createdAt: "2026-05-12T10:15:00Z",
   },
   {
     id: "prop-004",
     ownerId: "agent-123",
     title: "Офісне приміщення (Open Space)",
     address: "Київ, вул. Полярна, 10",
     type: "COMMERCIAL",
     status: "RENTED",
     salePrice: null,
     rentPrice: 2500,
     currency: "USD",
     isForSale: false,
     isForRent: true,
     area: 120,
     floor: 2,
     images: ["https://picsum.photos/800/600?random=5"],
     description:
       "Повністю облаштований офіс для IT-команди на 20 робочих місць.",
     benefits: ["WIFI", "PARKING", "SECURITY", "AIR_CONDITIONING"],
     createdAt: "2026-04-20T16:45:00Z",
   },
 ]
  const [data, setData] = useState(MOCK_PROPERTIES)

  return (
    <div className="rounded-md border bg-card">
      <UniversalTable
        data={data as []}
        columns={userColumns}
        onChange={({ id, key, value }) =>
          setData((prev) =>
            prev.map(
              (item) =>
                item.id === id
                  ? { ...item, [key]: value } // Створюємо новий об'єкт (копію)
                  : item // Залишаємо старе посилання для незмінених елементів
            )
          )
        }
      />
    </div>
  )
}
