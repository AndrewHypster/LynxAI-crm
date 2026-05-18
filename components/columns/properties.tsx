import { BedDouble, KeyRound, Layers, MapPin, Square, Tag } from "lucide-react";
import { ColumnConfig } from "../table";
import { BaseProperty, PROPERTY_STATUS_CONFIG, PROPERTY_TYPE_CONFIG } from "@/lib/constants";

export const propertyColumns: ColumnConfig<BaseProperty>[] = [
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
