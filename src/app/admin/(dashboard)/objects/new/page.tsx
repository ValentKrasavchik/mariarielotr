import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyFormSimple } from "@/components/admin/property-form-simple";

export default function NewObjectPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/objects"
        className="inline-flex min-h-11 items-center gap-2 text-base text-muted hover:text-gold-light"
      >
        <ArrowLeft size={18} />
        К списку объектов
      </Link>

      <h1 className="mt-4 serif-title text-3xl text-cream sm:text-4xl">
        Новый объект
      </h1>
      <p className="mt-3 text-base leading-7 text-muted">
        Заполните по шагам — на каждом экране только нужные поля. Технические
        настройки скрыты, фото можно добавить с телефона.
      </p>

      <div className="mt-6">
        <PropertyFormSimple />
      </div>
    </div>
  );
}
