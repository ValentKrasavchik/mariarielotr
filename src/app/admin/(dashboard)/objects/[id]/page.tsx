import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";
import { updateProperty } from "@/lib/admin-actions";
import { prisma } from "@/lib/prisma";

type EditObjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditObjectPage({
  params,
  searchParams,
}: EditObjectPageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      videos: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Link
          href="/admin/objects"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold-light"
        >
          <ArrowLeft size={17} />
          К списку объектов
        </Link>
        <Link
          href={`/objects/${property.slug}`}
          className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm text-muted hover:border-gold hover:text-gold-light"
        >
          <ExternalLink size={16} />
          Открыть на сайте
        </Link>
      </div>
      <h1 className="mt-4 serif-title text-4xl text-cream">
        Редактирование объекта
      </h1>
      {saved ? (
        <p className="mt-4 border border-gold/50 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          Изменения сохранены.
        </p>
      ) : null}
      <div className="mt-8">
        <PropertyForm
          property={property}
          action={updateProperty.bind(null, property.id)}
        />
      </div>
    </div>
  );
}
