import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  Calendar,
  CheckCircle2,
  Home,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Sofa,
  Sparkles,
} from "lucide-react";
import { MaxIcon } from "@/components/icons/max-icon";
import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  dealTypeLabels,
  getLabel,
  objectTypeLabels,
  statusLabels,
} from "@/lib/constants";
import { compactAddress, formatPrice, splitLines } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getSettings, maxMessengerLink, siteUrl, whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

type ObjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ObjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  if (!property) {
    return {
      title: "Объект не найден",
    };
  }

  const title =
    property.seoTitle ??
    `${property.title} - ${formatPrice(property.price, property.currency, property.dealType)}`;
  const description =
    property.seoDescription ??
    `${property.title}: ${compactAddress(property.city, property.district)}, ${property.area} м².`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/objects/${property.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/objects/${property.slug}`,
      images: property.images[0]?.url ? [property.images[0].url] : undefined,
    },
  };
}

export default async function ObjectPage({ params }: ObjectPageProps) {
  const { slug } = await params;
  const [settings, property] = await Promise.all([
    getSettings(),
    prisma.property.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        videos: { orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  if (!property || !property.isPublished) {
    notFound();
  }

  const images = property.images.length
    ? property.images
    : [{ id: "fallback", url: "/property-placeholder.svg", alt: property.title }];

  const benefits = splitLines(property.benefits);
  const objectUrl = `${siteUrl}/objects/${property.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description,
    image: images.map((image) => image.url),
    url: objectUrl,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability:
        property.status === "actual"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
  };

  const characteristics = [
    ["Тип объекта", getLabel(objectTypeLabels, property.objectType), Home],
    ["Тип сделки", getLabel(dealTypeLabels, property.dealType), Sparkles],
    ["Площадь", `${property.area} м²`, Ruler],
    ["Комнаты", property.rooms ? `${property.rooms}` : "Свободная планировка", Sofa],
    ["Этаж", property.floor ? `${property.floor} из ${property.floors ?? "?"}` : "Не указан", Layers],
    ["Санузел", property.bathroom ?? "Не указан", Bath],
    ["Ремонт", property.renovation ?? "Не указан", CheckCircle2],
    ["Год постройки", property.builtYear ? `${property.builtYear}` : "Не указан", Calendar],
  ];

  return (
    <>
      <SiteHeader phone={settings.phone} />
      <main>
        <section className="border-b border-line py-10">
          <div className="section-shell">
            <Link
              href="/objects"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold-light"
            >
              <ArrowLeft size={17} />
              Все объекты
            </Link>
          </div>
        </section>

        <section className="py-12">
          <div className="section-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden border border-line bg-card">
                <Image
                  src={images[0].url}
                  alt={images[0].alt ?? property.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
              {images.length > 1 ? (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {images.slice(1, 4).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-[4/3] overflow-hidden border border-line bg-card"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt ?? property.title}
                        fill
                        sizes="(min-width: 1024px) 18vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              {property.videos.length ? (
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.22em] text-gold-light">
                    Видео объекта
                  </p>
                  <div className="mt-4 grid gap-4">
                    {property.videos.map((video) => (
                      <div
                        key={video.id}
                        className="overflow-hidden border border-line bg-card"
                      >
                        <video
                          controls
                          preload="metadata"
                          playsInline
                          className="aspect-video w-full bg-graphite-deep object-cover"
                        >
                          <source src={video.url} />
                          Ваш браузер не поддерживает видео.
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-line bg-card p-6 md:p-8">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-graphite-deep">
                    {getLabel(statusLabels, property.status)}
                  </span>
                  <span className="border border-line px-3 py-1 text-xs text-muted">
                    {getLabel(dealTypeLabels, property.dealType)}
                  </span>
                </div>
                <h1 className="serif-title text-4xl leading-tight text-cream sm:text-5xl">
                  {property.title}
                </h1>
                <p className="mt-5 text-3xl font-semibold text-gold-light">
                  {formatPrice(property.price, property.currency, property.dealType)}
                </p>
                <p className="mt-4 flex items-center gap-2 text-muted">
                  <MapPin size={18} className="text-gold" />
                  {property.address ?? compactAddress(property.city, property.district)}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <a
                    href={`tel:${settings.phone.replace(/\D/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-4 font-semibold text-graphite-deep hover:bg-gold-light"
                  >
                    <Phone size={18} />
                    Позвонить
                  </a>
                  <a
                    href={whatsappLink(settings.whatsapp, `Здравствуйте, интересует объект: ${property.title}`)}
                    className="inline-flex items-center justify-center gap-2 border border-line px-5 py-4 font-semibold text-cream hover:border-gold hover:text-gold-light"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                  <a
                    href={maxMessengerLink(settings.maxMessenger)}
                    className="inline-flex items-center justify-center gap-2 border border-line px-5 py-4 font-semibold text-cream hover:border-gold hover:text-gold-light"
                  >
                    <MaxIcon size={18} />
                    MAX
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-graphite-deep py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                Характеристики
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {characteristics.map(([label, value, Icon]) => (
                  <div key={label as string} className="border border-line bg-card p-5">
                    <Icon className="text-gold" size={22} />
                    <p className="mt-4 text-sm text-muted">{label as string}</p>
                    <p className="mt-1 text-lg text-cream">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                Описание
              </p>
              <p className="mt-6 text-lg leading-8 text-muted">
                {property.description}
              </p>

              {benefits.length ? (
                <div className="mt-10">
                  <h2 className="serif-title text-3xl text-cream">
                    Преимущества объекта
                  </h2>
                  <div className="mt-5 grid gap-3">
                    {benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3 text-muted">
                        <CheckCircle2 className="mt-1 text-gold" size={18} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                Консультация по объекту
              </p>
              <h2 className="mt-4 serif-title text-4xl text-cream">
                Расскажу детали, проверю документы и подберу удобное время просмотра
              </h2>
            </div>
            <div className="border border-line bg-card p-6 md:p-8">
              <LeadForm propertyId={property.id} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        telegram={settings.telegram}
        maxMessenger={settings.maxMessenger}
        email={settings.email}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
