import type { Property, PropertyImage, PropertyVideo } from "@/generated/prisma";
import Image from "next/image";
import {
  dealTypeOptions,
  objectTypeOptions,
  statusOptions,
} from "@/lib/constants";
import { deletePropertyImage, deletePropertyVideo } from "@/lib/admin-actions";

type PropertyWithImages = Property & {
  images: PropertyImage[];
  videos?: PropertyVideo[];
};

type PropertyFormProps = {
  property?: PropertyWithImages;
  action: (formData: FormData) => void | Promise<void>;
};

function value(value?: string | number | null) {
  return value ?? "";
}

export function PropertyForm({ property, action }: PropertyFormProps) {
  return (
    <div className="space-y-8">
      <form action={action} className="space-y-8">
        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Основное</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-muted md:col-span-2">
              <span>Название</span>
              <input name="title" required defaultValue={property?.title} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Slug</span>
              <input name="slug" defaultValue={property?.slug} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Цена</span>
              <input name="price" type="number" required defaultValue={property?.price} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Валюта</span>
              <input name="currency" defaultValue={property?.currency ?? "RUB"} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Порядок</span>
              <input name="sortOrder" type="number" defaultValue={property?.sortOrder ?? 0} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Тип сделки</span>
              <select name="dealType" defaultValue={property?.dealType ?? "sale"} className="h-12 px-4">
                {dealTypeOptions.map(([optionValue, label]) => (
                  <option key={optionValue} value={optionValue}>{label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Тип объекта</span>
              <select name="objectType" defaultValue={property?.objectType ?? "apartment"} className="h-12 px-4">
                {objectTypeOptions.map(([optionValue, label]) => (
                  <option key={optionValue} value={optionValue}>{label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Статус</span>
              <select name="status" defaultValue={property?.status ?? "actual"} className="h-12 px-4">
                {statusOptions.map(([optionValue, label]) => (
                  <option key={optionValue} value={optionValue}>{label}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 self-end text-sm text-muted">
              <input
                name="isPublished"
                type="checkbox"
                defaultChecked={property?.isPublished ?? true}
                className="size-4 w-4"
              />
              Опубликован
            </label>
            <label className="flex items-center gap-3 self-end text-sm text-muted">
              <input
                name="showInHero"
                type="checkbox"
                defaultChecked={property?.showInHero ?? false}
                className="size-4 w-4"
              />
              Показывать в Hero
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Порядок в Hero</span>
              <input
                name="heroOrder"
                type="number"
                defaultValue={property?.heroOrder ?? 0}
                className="h-12 px-4"
              />
            </label>
          </div>
        </section>

        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Адрес и характеристики</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-muted">
              <span>Город</span>
              <input name="city" required defaultValue={property?.city ?? "Донецк"} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Район</span>
              <input name="district" required defaultValue={property?.district} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Адрес</span>
              <input name="address" defaultValue={value(property?.address)} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Площадь</span>
              <input name="area" type="number" step="0.1" required defaultValue={property?.area} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Комнаты</span>
              <input name="rooms" type="number" defaultValue={value(property?.rooms)} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Этаж</span>
              <input name="floor" type="number" defaultValue={value(property?.floor)} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Этажность дома</span>
              <input name="floors" type="number" defaultValue={value(property?.floors)} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Санузел</span>
              <input name="bathroom" defaultValue={value(property?.bathroom)} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Ремонт</span>
              <input name="renovation" defaultValue={value(property?.renovation)} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Год постройки</span>
              <input name="builtYear" type="number" defaultValue={value(property?.builtYear)} className="h-12 px-4" />
            </label>
          </div>
        </section>

        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Описание и SEO</h2>
          <div className="mt-5 grid gap-4">
            <label className="space-y-2 text-sm text-muted">
              <span>Описание</span>
              <textarea name="description" required defaultValue={property?.description} className="px-4 py-3" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Преимущества, каждое с новой строки</span>
              <textarea name="benefits" defaultValue={value(property?.benefits)} className="px-4 py-3" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>SEO title</span>
              <input name="seoTitle" defaultValue={value(property?.seoTitle)} className="h-12 px-4" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>SEO description</span>
              <textarea name="seoDescription" defaultValue={value(property?.seoDescription)} className="px-4 py-3" />
            </label>
          </div>
        </section>

        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Фото и видео</h2>
          <div className="mt-5 grid gap-4">
            <label className="space-y-2 text-sm text-muted">
              <span>Загрузить фото</span>
              <input name="photos" type="file" accept="image/*" multiple className="px-4 py-3" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Или вставить URL фото, каждый с новой строки</span>
              <textarea name="imageUrls" className="px-4 py-3" />
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Загрузить видео</span>
              <input name="videos" type="file" accept="video/*" multiple className="px-4 py-3" />
              <span className="block text-xs leading-5 text-muted">
                Подойдут MP4/WebM и другие видеоформаты, которые поддерживает браузер.
              </span>
            </label>
            <label className="space-y-2 text-sm text-muted">
              <span>Или вставить URL видео, каждый с новой строки</span>
              <textarea
                name="videoUrls"
                placeholder="Например: /uploads/properties/videos/example.mp4"
                className="px-4 py-3"
              />
            </label>
          </div>
        </section>

        <button type="submit" className="bg-gold px-7 py-4 font-semibold text-graphite-deep hover:bg-gold-light">
          {property ? "Сохранить объект" : "Создать объект"}
        </button>
      </form>

      {property?.images.length ? (
        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Загруженные фото</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {property.images.map((image) => (
              <div key={image.id} className="overflow-hidden border border-line">
                <div className="relative aspect-[4/3] bg-graphite-deep">
                  <Image src={image.url} alt={image.alt ?? property.title} fill className="object-cover" sizes="240px" />
                </div>
                <form action={deletePropertyImage} className="p-3">
                  <input type="hidden" name="id" value={image.id} />
                  <button type="submit" className="w-full border border-line px-3 py-2 text-sm text-muted hover:border-gold hover:text-gold-light">
                    Удалить фото
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {property?.videos?.length ? (
        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Загруженные видео</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {property.videos.map((video) => (
              <div key={video.id} className="overflow-hidden border border-line">
                <video
                  controls
                  preload="metadata"
                  className="aspect-video w-full bg-graphite-deep object-cover"
                >
                  <source src={video.url} />
                  Ваш браузер не поддерживает видео.
                </video>
                <div className="space-y-3 p-3">
                  <p className="break-all text-xs text-muted">{video.url}</p>
                  <form action={deletePropertyVideo}>
                    <input type="hidden" name="id" value={video.id} />
                    <button type="submit" className="w-full border border-line px-3 py-2 text-sm text-muted hover:border-gold hover:text-gold-light">
                      Удалить видео
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
