import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";
import { createProperty } from "@/lib/admin-actions";

export default function NewObjectPage() {
  return (
    <div>
      <Link
        href="/admin/objects"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold-light"
      >
        <ArrowLeft size={17} />
        К списку объектов
      </Link>
      <h1 className="mt-4 serif-title text-4xl text-cream">Новый объект</h1>
      <div className="mt-8">
        <PropertyForm action={createProperty} />
      </div>
    </div>
  );
}
