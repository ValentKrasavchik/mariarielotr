import { CheckCircle2, EyeOff, Plus, Trash2 } from "lucide-react";
import {
  createReview,
  deleteReview,
  toggleReviewPublish,
  updateReview,
} from "@/lib/admin-actions";
import { prisma } from "@/lib/prisma";

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ isPublished: "asc" }, { date: "desc" }],
  });

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-gold-light">
        Отзывы
      </p>
      <h1 className="mt-3 serif-title text-4xl text-cream">
        Управление отзывами
      </h1>

      <section className="mt-8 border border-line bg-card p-5 md:p-6">
        <h2 className="serif-title text-2xl text-cream">Добавить отзыв</h2>
        <form action={createReview} className="mt-5 grid gap-4 md:grid-cols-2">
          <input name="clientName" required placeholder="Имя клиента" className="h-12 px-4" />
          <input name="rating" type="number" min="1" max="5" defaultValue={5} className="h-12 px-4" />
          <input name="date" type="date" defaultValue={dateInputValue(new Date())} className="h-12 px-4" />
          <input name="photo" placeholder="URL фото клиента" className="h-12 px-4" />
          <textarea name="text" required placeholder="Текст отзыва" className="px-4 py-3 md:col-span-2" />
          <label className="flex items-center gap-3 text-sm text-muted">
            <input name="isPublished" type="checkbox" defaultChecked className="size-4 w-4" />
            Опубликован
          </label>
          <button className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-3 font-semibold text-graphite-deep hover:bg-gold-light md:justify-self-end">
            <Plus size={18} />
            Добавить
          </button>
        </form>
      </section>

      <div className="mt-8 space-y-5">
        {reviews.map((review) => (
          <article
            key={review.id}
            className={`border bg-card p-5 md:p-6 ${
              review.isPublished ? "border-line" : "border-gold/60"
            }`}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  review.isPublished
                    ? "border border-line text-muted"
                    : "bg-gold text-graphite-deep"
                }`}
              >
                {review.isPublished ? "Опубликован" : "На проверке"}
              </span>
              <form action={toggleReviewPublish.bind(null, review.id, review.isPublished)}>
                <button className="inline-flex items-center gap-2 border border-line px-3 py-2 text-sm text-muted hover:border-gold hover:text-gold-light">
                  {review.isPublished ? <EyeOff size={16} /> : <CheckCircle2 size={16} />}
                  {review.isPublished ? "Скрыть" : "Опубликовать"}
                </button>
              </form>
            </div>
            <form action={updateReview.bind(null, review.id)} className="grid gap-4 md:grid-cols-2">
              <input name="clientName" defaultValue={review.clientName} className="h-12 px-4" />
              <input name="rating" type="number" min="1" max="5" defaultValue={review.rating} className="h-12 px-4" />
              <input name="date" type="date" defaultValue={dateInputValue(review.date)} className="h-12 px-4" />
              <input name="photo" defaultValue={review.photo ?? ""} placeholder="URL фото" className="h-12 px-4" />
              <textarea name="text" defaultValue={review.text} className="px-4 py-3 md:col-span-2" />
              <label className="flex items-center gap-3 text-sm text-muted">
                <input name="isPublished" type="checkbox" defaultChecked={review.isPublished} className="size-4 w-4" />
                Опубликован
              </label>
              <button className="bg-gold px-5 py-3 font-semibold text-graphite-deep hover:bg-gold-light md:justify-self-end">
                Сохранить
              </button>
            </form>
            <form action={deleteReview} className="mt-4">
              <input type="hidden" name="id" value={review.id} />
              <button className="inline-flex items-center gap-2 border border-red-400/40 px-4 py-2 text-sm text-red-100 hover:bg-red-500/10">
                <Trash2 size={16} />
                Удалить
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
