import type { Property, PropertyImage } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Ruler, Sofa } from "lucide-react";
import {
  dealTypeLabels,
  getLabel,
  objectTypeLabels,
  statusLabels,
} from "@/lib/constants";
import { compactAddress, formatPrice } from "@/lib/format";

type PropertyCardProps = {
  property: Property & { images: PropertyImage[] };
};

export function PropertyCard({ property }: PropertyCardProps) {
  const image = property.images[0]?.url ?? "/property-placeholder.svg";

  return (
    <article className="group overflow-hidden border border-line bg-card shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
      <Link href={`/objects/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-graphite-deep">
          <Image
            src={image}
            alt={property.images[0]?.alt ?? property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite-deep/80 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-graphite-deep">
              {getLabel(statusLabels, property.status)}
            </span>
            <span className="border border-line bg-graphite/72 px-3 py-1 text-xs text-cream backdrop-blur">
              {getLabel(dealTypeLabels, property.dealType)}
            </span>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="text-sm text-gold-light">
              {getLabel(objectTypeLabels, property.objectType)}
            </p>
            <h3 className="mt-2 serif-title text-2xl leading-tight text-cream">
              {property.title}
            </h3>
          </div>

          <p className="text-2xl font-semibold text-gold-light">
            {formatPrice(property.price, property.currency, property.dealType)}
          </p>

          <div className="grid grid-cols-3 gap-3 border-y border-line py-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Ruler size={16} className="text-gold" />
              {property.area} м²
            </span>
            <span className="flex items-center gap-2">
              <Sofa size={16} className="text-gold" />
              {property.rooms ? `${property.rooms} комн.` : "Своб."}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-gold" />
              {property.district}
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-muted">
            {property.description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">
              {compactAddress(property.city, property.district)}
            </span>
            <span className="inline-flex items-center gap-2 text-gold-light">
              Подробнее
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
