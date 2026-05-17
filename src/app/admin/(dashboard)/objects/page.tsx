import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { deleteProperty, togglePropertyPublish } from "@/lib/admin-actions";
import {
  dealTypeLabels,
  getLabel,
  objectTypeLabels,
  statusLabels,
} from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminObjectsPage() {
  const properties = await prisma.property.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-gold-light">
            Объекты
          </p>
          <h1 className="mt-3 serif-title text-4xl text-cream">
            Управление объектами
          </h1>
        </div>
        <Link
          href="/admin/objects/new"
          className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-3 font-semibold text-graphite-deep hover:bg-gold-light"
        >
          <Plus size={18} />
          Создать объект
        </Link>
      </div>

      <div className="mt-8 overflow-hidden border border-line bg-card">
        <div className="hidden grid-cols-[1.35fr_0.75fr_0.75fr_0.75fr_0.65fr_0.8fr] gap-4 border-b border-line px-5 py-3 text-xs uppercase tracking-[0.16em] text-muted lg:grid">
          <span>Название</span>
          <span>Цена</span>
          <span>Тип</span>
          <span>Статус</span>
          <span>Hero</span>
          <span>Действия</span>
        </div>
        <div className="divide-y divide-line">
          {properties.map((property) => (
            <div
              key={property.id}
              className="grid gap-4 px-5 py-5 lg:grid-cols-[1.35fr_0.75fr_0.75fr_0.75fr_0.65fr_0.8fr] lg:items-center"
            >
              <div>
                <Link
                  href={`/admin/objects/${property.id}`}
                  className="text-lg font-semibold text-cream hover:text-gold-light"
                >
                  {property.title}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  {property.city}, {property.district} · создан{" "}
                  {formatDate(property.createdAt)}
                </p>
              </div>
              <p className="text-gold-light">
                {formatPrice(property.price, property.currency, property.dealType)}
              </p>
              <p className="text-sm text-muted">
                {getLabel(dealTypeLabels, property.dealType)} ·{" "}
                {getLabel(objectTypeLabels, property.objectType)}
              </p>
              <p className="text-sm text-muted">
                {getLabel(statusLabels, property.status)} ·{" "}
                {property.isPublished ? "опубликован" : "черновик"}
              </p>
              <div className="text-sm text-muted">
                {property.showInHero ? (
                  <span className="inline-flex items-center gap-2 text-gold-light">
                    <Sparkles size={15} />
                    Hero #{property.heroOrder}
                  </span>
                ) : (
                  <span>Не в Hero</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/objects/${property.id}`}
                  className="inline-flex items-center gap-2 border border-gold/50 px-3 py-2 text-sm text-gold-light hover:border-gold hover:bg-gold/10"
                >
                  <Pencil size={16} />
                  Редактировать
                </Link>
                <form action={togglePropertyPublish.bind(null, property.id, property.isPublished)}>
                  <button className="inline-flex items-center gap-2 border border-line px-3 py-2 text-sm text-muted hover:border-gold hover:text-gold-light">
                    {property.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                    {property.isPublished ? "Скрыть" : "Опубликовать"}
                  </button>
                </form>
                <form action={deleteProperty}>
                  <input type="hidden" name="id" value={property.id} />
                  <button className="inline-flex items-center gap-2 border border-red-400/40 px-3 py-2 text-sm text-red-100 hover:bg-red-500/10">
                    <Trash2 size={16} />
                    Удалить
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
