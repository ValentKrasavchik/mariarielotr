import { Search, SlidersHorizontal } from "lucide-react";
import {
  dealTypeOptions,
  objectTypeOptions,
  statusOptions,
} from "@/lib/constants";

type ObjectFiltersProps = {
  values: Record<string, string | undefined>;
  cities: string[];
  districts: string[];
};

export function ObjectFilters({ values, cities, districts }: ObjectFiltersProps) {
  return (
    <form
      action="/objects"
      className="border border-line bg-card p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
    >
      <div className="mb-5 flex items-center gap-3 text-gold-light">
        <SlidersHorizontal size={20} />
        <h2 className="font-semibold">Фильтры</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="space-y-2 text-sm text-muted">
          <span>Тип сделки</span>
          <select name="dealType" defaultValue={values.dealType ?? ""} className="h-12 px-3">
            <option value="">Все</option>
            {dealTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-muted">
          <span>Тип объекта</span>
          <select name="objectType" defaultValue={values.objectType ?? ""} className="h-12 px-3">
            <option value="">Все</option>
            {objectTypeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-muted">
          <span>Комнат</span>
          <input
            name="rooms"
            type="number"
            min="0"
            defaultValue={values.rooms ?? ""}
            placeholder="Любое"
            className="h-12 px-3"
          />
        </label>

        <label className="space-y-2 text-sm text-muted">
          <span>Цена от</span>
          <input name="priceFrom" type="number" defaultValue={values.priceFrom ?? ""} className="h-12 px-3" />
        </label>

        <label className="space-y-2 text-sm text-muted">
          <span>Цена до</span>
          <input name="priceTo" type="number" defaultValue={values.priceTo ?? ""} className="h-12 px-3" />
        </label>

        <label className="space-y-2 text-sm text-muted">
          <span>Статус</span>
          <select name="status" defaultValue={values.status ?? ""} className="h-12 px-3">
            <option value="">Все</option>
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-muted md:col-span-1 xl:col-span-2">
          <span>Город</span>
          <select name="city" defaultValue={values.city ?? ""} className="h-12 px-3">
            <option value="">Все города</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-muted md:col-span-1 xl:col-span-2">
          <span>Район</span>
          <select name="district" defaultValue={values.district ?? ""} className="h-12 px-3">
            <option value="">Все районы</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 self-end bg-gold px-5 font-semibold text-graphite-deep hover:bg-gold-light md:col-span-2 xl:col-span-2"
        >
          <Search size={18} />
          Показать объекты
        </button>
      </div>
    </form>
  );
}
