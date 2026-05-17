import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma";
import { ObjectFilters } from "@/components/object-filters";
import { PropertyCard } from "@/components/property-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { getSettings, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Актуальные объекты недвижимости",
  description:
    "Каталог объектов риелтора Марии: квартиры, дома, участки и коммерческая недвижимость в Донецке и Донецкой области.",
  alternates: {
    canonical: `${siteUrl}/objects`,
  },
};

type ObjectsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function param(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function numberParam(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function ObjectsPage({ searchParams }: ObjectsPageProps) {
  const rawParams = (await searchParams) ?? {};
  const values = {
    dealType: param(rawParams, "dealType"),
    objectType: param(rawParams, "objectType"),
    rooms: param(rawParams, "rooms"),
    priceFrom: param(rawParams, "priceFrom"),
    priceTo: param(rawParams, "priceTo"),
    city: param(rawParams, "city"),
    district: param(rawParams, "district"),
    status: param(rawParams, "status"),
  };

  const where: Prisma.PropertyWhereInput = {
    isPublished: true,
    ...(values.dealType ? { dealType: values.dealType } : {}),
    ...(values.objectType ? { objectType: values.objectType } : {}),
    ...(values.status ? { status: values.status } : {}),
    ...(values.city ? { city: values.city } : {}),
    ...(values.district ? { district: values.district } : {}),
    ...(numberParam(values.rooms) !== undefined
      ? { rooms: numberParam(values.rooms) }
      : {}),
    ...(numberParam(values.priceFrom) || numberParam(values.priceTo)
      ? {
          price: {
            ...(numberParam(values.priceFrom)
              ? { gte: numberParam(values.priceFrom) }
              : {}),
            ...(numberParam(values.priceTo)
              ? { lte: numberParam(values.priceTo) }
              : {}),
          },
        }
      : {}),
  };

  const [settings, properties, cityRows, districtRows] = await Promise.all([
    getSettings(),
    prisma.property.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.property.findMany({
      where: { isPublished: true },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
    prisma.property.findMany({
      where: { isPublished: true },
      select: { district: true },
      distinct: ["district"],
      orderBy: { district: "asc" },
    }),
  ]);

  return (
    <>
      <SiteHeader phone={settings.phone} />
      <main>
        <section className="border-b border-line py-16">
          <div className="section-shell">
            <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
              Каталог
            </p>
            <h1 className="mt-4 serif-title text-5xl leading-tight text-cream sm:text-6xl">
              Актуальные объекты недвижимости
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Фильтруйте объекты по типу сделки, бюджету, району и статусу.
              Каждый объект можно обсудить с Марией лично.
            </p>
          </div>
        </section>

        <section className="bg-graphite-deep py-10">
          <div className="section-shell">
            <ObjectFilters
              values={values}
              cities={cityRows.map((row) => row.city)}
              districts={districtRows.map((row) => row.district)}
            />
          </div>
        </section>

        <section className="py-16">
          <div className="section-shell">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-muted">
                Найдено объектов:{" "}
                <span className="text-gold-light">{properties.length}</span>
              </p>
            </div>

            {properties.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="border border-line bg-card p-10 text-center">
                <p className="serif-title text-3xl text-cream">
                  По выбранным фильтрам объектов не найдено
                </p>
                <p className="mt-3 text-muted">
                  Попробуйте изменить параметры или оставьте заявку на подбор.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        telegram={settings.telegram}
        email={settings.email}
      />
    </>
  );
}
