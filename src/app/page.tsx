import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  KeyRound,
  Landmark,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { TelegramIcon } from "@/components/icons/telegram-icon";
import { LeadForm } from "@/components/lead-form";
import { PropertyCard } from "@/components/property-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { compactAddress, formatDate, formatPrice } from "@/lib/format";
import { getSettings, siteUrl, telegramLink, whatsappLink } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      url: siteUrl,
    },
  };
}

const services = [
  {
    icon: Landmark,
    title: "Продажа недвижимости",
    text: "Подготовка объекта, позиционирование, показы и переговоры по цене.",
  },
  {
    icon: KeyRound,
    title: "Покупка квартиры",
    text: "Поиск вариантов, проверка документов и сопровождение до регистрации.",
  },
  {
    icon: Search,
    title: "Подбор объекта",
    text: "Фильтрация рынка под задачу, бюджет, район и сценарий жизни.",
  },
  {
    icon: ClipboardCheck,
    title: "Сопровождение сделки",
    text: "Контроль этапов, коммуникаций, сроков и юридически важных деталей.",
  },
  {
    icon: Scale,
    title: "Оценка недвижимости",
    text: "Реалистичная цена с учетом рынка, состояния объекта и спроса.",
  },
  {
    icon: MessageCircle,
    title: "Консультация по рынку",
    text: "Понятная стратегия перед покупкой, продажей или инвестицией.",
  },
];

const steps = [
  {
    title: "Консультация",
    text: "Обсуждаем задачу, бюджет, сроки и формат сопровождения.",
  },
  {
    title: "Анализ задачи",
    text: "Оцениваем ситуацию, объект, документы и возможные риски.",
  },
  {
    title: "Подбор или подготовка объекта",
    text: "Подбираем подходящие варианты или готовим объект к продаже.",
  },
  {
    title: "Показы и переговоры",
    text: "Организуем просмотры и ведем переговоры в интересах клиента.",
  },
  {
    title: "Сопровождение сделки",
    text: "Контролируем этапы сделки до финального результата.",
  },
];

const facts = [
  {
    number: "01",
    icon: Search,
    title: "Индивидуальная стратегия под задачу клиента",
    text: "Работа строится от цели, бюджета и реальной ситуации на рынке.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Проверка документов и спокойная коммуникация",
    text: "Риски объясняются заранее и понятным языком.",
  },
  {
    number: "03",
    icon: Scale,
    title: "Переговоры в интересах клиента до результата",
    text: "Цена, сроки и условия сделки защищаются на каждом этапе.",
  },
  {
    number: "04",
    icon: BadgeCheck,
    title: "Сопровождение на каждом этапе сделки",
    text: "Мария остается рядом до финального оформления.",
  },
];

export default async function HomePage() {
  const [settings, properties, heroProperties, reviews] = await Promise.all([
    getSettings(),
    prisma.property.findMany({
      where: { isPublished: true, status: "actual" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 8,
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.property.findMany({
      where: { isPublished: true, status: "actual", showInHero: true },
      orderBy: [
        { heroOrder: "asc" },
        { sortOrder: "asc" },
        { updatedAt: "desc" },
      ],
      take: 3,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    }),
    prisma.review.findMany({
      where: { isPublished: true },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Мария Риелтор",
    url: siteUrl,
    telephone: settings.phone,
    email: settings.email,
    areaServed: settings.region,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Донецк",
      addressCountry: "RU",
    },
  };

  return (
    <>
      <SiteHeader phone={settings.phone} />
      <main>
        <section
          className="relative min-h-[calc(100vh-80px)] overflow-hidden border-b border-line bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(31, 30, 27, 1) 0%, rgba(31, 30, 27, 0.98) 32%, rgba(31, 30, 27, 0.86) 62%, rgba(31, 30, 27, 0.26) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite-deep/40 via-transparent to-graphite-deep/20" />
          <div className="pointer-events-none absolute bottom-5 left-[max(1rem,calc((100vw-1180px)/2))] right-[max(1rem,calc((100vw-1180px)/2))] top-5 border border-line/70 min-[400px]:left-[max(1.25rem,calc((100vw-1180px)/2))] min-[400px]:right-[max(1.25rem,calc((100vw-1180px)/2))] md:bottom-8 md:top-8 lg:bottom-10 lg:top-10">
            <span className="absolute -left-px top-0 h-16 w-px bg-gold-light/60" />
            <span className="absolute left-0 -top-px h-px w-16 bg-gold-light/60" />
            <span className="absolute -right-px bottom-0 h-16 w-px bg-gold-light/60" />
            <span className="absolute bottom-0 right-0 h-px w-16 bg-gold-light/60" />
          </div>

          <div className="section-shell relative min-h-[calc(100vh-80px)] py-16 pt-24 min-[480px]:py-[4.5rem] min-[480px]:pt-28 md:py-20 md:pt-32 xl:py-24 xl:pt-36">
            <div className="min-w-0 w-full max-w-[50rem] px-5 min-[480px]:px-6 min-[640px]:px-8 md:px-10 lg:px-12 xl:max-w-[55rem] xl:px-14">
              <div className="mb-6 flex items-center gap-4 text-base text-cream/90 sm:gap-6 sm:text-lg">
                <p>{settings.heroTitle}</p>
                <span className="h-px w-14 bg-gold-light/65 sm:w-24" />
              </div>
              <h1 className="serif-title max-w-[16.5rem] text-balance break-words text-[clamp(2rem,5.6vw,3.75rem)] leading-[1.08] text-cream drop-shadow-2xl min-[480px]:max-w-full md:max-w-[42rem] xl:max-w-4xl xl:text-7xl">
                {settings.heroSubtitle}
              </h1>
              <p className="mt-6 max-w-[15.5rem] text-base leading-7 text-cream/90 drop-shadow-lg [overflow-wrap:anywhere] min-[480px]:max-w-[35rem] min-[480px]:text-lg md:text-xl md:leading-8">
                {settings.heroText}
              </p>

              <div className="hero-cta-group mt-7 flex w-full max-w-[16.5rem] flex-col gap-3 min-[480px]:max-w-[35rem] min-[640px]:flex-row min-[640px]:items-center">
                <Link
                  href="#contacts"
                  className="hero-cta-primary inline-flex w-full items-center justify-center gap-2 border border-gold-light/70 bg-gold px-5 py-3.5 text-sm font-semibold text-graphite-deep shadow-lg shadow-black/15 hover:border-gold-light hover:bg-gold-light"
                >
                  Получить консультацию
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className="mt-4 w-full max-w-[16.5rem] min-[480px]:max-w-[35rem]">
                <p className="text-xs uppercase tracking-[0.18em] text-cream/70">
                  Или напишите напрямую
                </p>
                <div className="mt-3 grid gap-3 min-[480px]:grid-cols-2">
                  <a
                    href={whatsappLink(settings.whatsapp)}
                    className="inline-flex items-center justify-center gap-2 border border-line bg-graphite-deep/20 px-4 py-3 text-sm font-semibold text-cream hover:border-gold-light hover:bg-gold/10 hover:text-gold-light"
                  >
                    <MessageCircle size={17} className="text-gold" />
                    WhatsApp
                  </a>
                  <a
                    href={telegramLink(settings.telegram)}
                    className="inline-flex items-center justify-center gap-2 border border-line bg-graphite-deep/20 px-4 py-3 text-sm font-semibold text-cream hover:border-gold-light hover:bg-gold/10 hover:text-gold-light"
                  >
                    <TelegramIcon size={17} className="text-gold" />
                    Telegram
                  </a>
                </div>
              </div>

              <div className="mt-9 grid w-full max-w-[16.5rem] grid-cols-1 gap-4 min-[480px]:max-w-[38rem] min-[520px]:grid-cols-2 md:mt-10 md:max-w-2xl md:grid-cols-3 xl:mt-12 xl:gap-5">
                <div className="border border-line/80 bg-graphite-deep/20 p-4 backdrop-blur-[1px]">
                  <p className="serif-title text-4xl font-semibold text-gold-light md:text-5xl">
                    7+
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cream/80 md:text-sm md:tracking-[0.18em]">
                    лет опыта
                  </p>
                </div>
                <div className="border border-line/80 bg-graphite-deep/20 p-4 backdrop-blur-[1px]">
                  <p className="serif-title text-4xl font-semibold text-gold-light md:text-5xl">
                    120+
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cream/80 md:text-sm md:tracking-[0.18em]">
                    сделок
                  </p>
                </div>
                <div className="border border-line/80 bg-graphite-deep/20 p-4 backdrop-blur-[1px] min-[520px]:col-span-2 md:col-span-1">
                  <p className="serif-title text-4xl font-semibold text-gold-light md:text-5xl">
                    24/7
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cream/80 md:text-sm md:tracking-[0.18em]">
                    контроль
                  </p>
                </div>
              </div>

              {heroProperties.length ? (
                <div className="hero-featured-properties mt-6 w-full max-w-[16.5rem] border border-line/80 bg-graphite-deep/42 p-4 shadow-2xl shadow-black/20 backdrop-blur-md min-[480px]:max-w-[38rem] min-[480px]:p-5 md:max-w-2xl md:p-6">
                  <div className="flex flex-col gap-4 min-[640px]:flex-row min-[640px]:items-end min-[640px]:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.22em] text-gold-light">
                        Актуальные объекты
                      </p>
                      <h2 className="mt-2 serif-title text-balance text-xl leading-tight text-cream min-[480px]:text-2xl">
                        Выбранные варианты для первого знакомства
                      </h2>
                    </div>
                    <Link
                      href="/objects"
                      className="group/hero-all inline-flex w-full shrink-0 items-center justify-center gap-2 border border-line bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-light hover:border-gold-light hover:bg-gold/15 min-[640px]:w-auto"
                    >
                      Смотреть все объекты
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover/hero-all:translate-x-1"
                      />
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {heroProperties.map((property, index) => {
                      const image =
                        property.images[0]?.url ?? "/property-placeholder.svg";
                      const details = [
                        `${property.area} м²`,
                        property.rooms ? `${property.rooms} комн.` : null,
                      ].filter(Boolean);

                      return (
                        <Link
                          key={property.id}
                          href={`/objects/${property.slug}`}
                          className="hero-property-card group grid min-w-0 gap-3 border border-line/65 bg-graphite-deep/38 p-3 backdrop-blur-sm min-[640px]:grid-cols-[124px_minmax(0,1fr)] md:grid-cols-[112px_minmax(0,1fr)]"
                          style={{ animationDelay: `${180 + index * 130}ms` }}
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-graphite-deep min-[640px]:aspect-auto min-[640px]:min-h-24">
                            <Image
                              src={image}
                              alt={property.images[0]?.alt ?? property.title}
                              fill
                              sizes="(min-width: 768px) 112px, (min-width: 640px) 124px, 100vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-graphite-deep/45 to-transparent" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="line-clamp-2 font-semibold leading-snug text-cream group-hover:text-gold-light">
                                  {property.title}
                                </h3>
                                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
                                  {compactAddress(property.city, property.district)}
                                </p>
                              </div>
                              <ArrowRight
                                size={16}
                                className="mt-1 shrink-0 text-gold-light transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </div>

                            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                              {details.length ? <span>{details.join(" · ")}</span> : null}
                              <span className="font-semibold text-gold-light">
                                {formatPrice(
                                  property.price,
                                  property.currency,
                                  property.dealType,
                                )}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section id="about" className="bg-graphite-deep py-24">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[420px] overflow-hidden border border-line bg-card">
              <div className="absolute inset-6 border border-line" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="mx-auto grid size-36 place-items-center border border-line text-5xl text-gold-light">
                    М
                  </div>
                  <p className="mt-6 serif-title text-3xl text-cream">
                    Мария
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">
                    персональный риелтор
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                О Марии
              </p>
              <h2 className="mt-4 serif-title text-4xl leading-tight text-cream sm:text-5xl">
                Спокойное сопровождение там, где важны документы, цена и доверие
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                {settings.aboutText}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Опытная оценка рыночной ситуации",
                  "Внимание к юридическим деталям",
                  "Бережная коммуникация с клиентом",
                  "Личное участие до результата",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-muted">
                    <CheckCircle2 className="mt-1 text-gold" size={19} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="services-section relative isolate overflow-hidden border-t border-line/15 bg-graphite-deep py-20 md:py-24"
        >
          <div className="section-shell relative z-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                Услуги
              </p>
              <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                Полный цикл работы с недвижимостью
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="border border-line bg-card p-6 hover:-translate-y-1 hover:border-gold"
                >
                  <service.icon className="text-gold" size={30} />
                  <h3 className="mt-6 serif-title text-2xl text-cream">
                    {service.title}
                  </h3>
                  <p className="mt-3 leading-7 text-muted">{service.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="objects" className="bg-graphite-deep py-24">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                  Актуальные объекты
                </p>
                <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                  Объекты, которые можно рассмотреть сейчас
                </h2>
              </div>
              <Link
                href="/objects"
                className="inline-flex items-center gap-2 border border-line px-6 py-4 font-semibold text-cream hover:border-gold hover:text-gold-light"
              >
                Все объекты
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        <section className="process-benefits-section relative overflow-hidden bg-graphite-deep py-16 md:py-20">
          <div className="section-shell relative">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="process-reveal">
                <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                  Как проходит работа
                </p>
                <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                  Понятный процесс без лишней суеты
                </h2>
                <p className="mt-5 max-w-md leading-7 text-muted">
                  Каждый этап прозрачен: вы понимаете, что происходит сейчас,
                  какой следующий шаг и где важно принять решение.
                </p>
              </div>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="process-step-card grid gap-4 border border-line bg-card/92 p-5 sm:grid-cols-[76px_1fr] sm:p-6"
                    style={{ animationDelay: `${120 + index * 90}ms` }}
                  >
                    <span className="serif-title text-4xl leading-none text-gold-light sm:border-r sm:border-line sm:pr-5 sm:text-center">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="serif-title text-2xl leading-tight text-cream">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-8 md:mt-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="process-reveal">
                <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                  Почему выбирают Марию
                </p>
                <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                  Высокий уровень сервиса в деталях
                </h2>
                <p className="mt-5 max-w-md leading-7 text-muted">
                  Важны не только найденный объект или покупатель, но и
                  спокойствие клиента в процессе.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {facts.map((fact, index) => {
                  const Icon = fact.icon;

                  return (
                    <div
                      key={fact.number}
                      className="benefit-card border border-line bg-card/92 p-7"
                      style={{ animationDelay: `${180 + index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="serif-title text-5xl text-gold-light">
                          {fact.number}
                        </p>
                        <Icon className="text-gold-light/85" size={30} />
                      </div>
                      <h3 className="mt-6 serif-title text-2xl leading-tight text-cream">
                        {fact.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-muted">
                        {fact.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="py-24">
          <div className="section-shell">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                Отзывы
              </p>
              <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                Клиенты ценят спокойствие и ясность
              </h2>
            </div>
            <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="flex h-full flex-col border border-line bg-card p-6"
                >
                  <div className="flex gap-1 text-gold-light">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 flex-1 leading-7 text-muted">
                    {review.text}
                  </p>
                  <div className="mt-6 border-t border-line pt-5">
                    <p className="font-semibold text-cream">
                      {review.clientName}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDate(review.date)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="bg-graphite-deep py-24">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                Контакты
              </p>
              <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                Обсудим вашу задачу по недвижимости
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-muted">
                Оставьте заявку - Мария свяжется с вами, уточнит детали и
                предложит следующий шаг.
              </p>
              <div className="mt-8 grid gap-4 text-muted sm:grid-cols-2 lg:grid-cols-1">
                <div className="border border-line/70 bg-card/70 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-light">
                    Телефон
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/\D/g, "")}`}
                    className="mt-3 flex items-center gap-3 font-semibold text-cream hover:text-gold-light"
                  >
                    <Phone size={19} className="text-gold" />
                    {settings.phone}
                  </a>
                </div>
                <div className="border border-line/70 bg-card/70 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-light">
                    Мессенджеры
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
                    <a
                      href={whatsappLink(settings.whatsapp)}
                      className="flex items-center gap-3 hover:text-gold-light"
                    >
                      <MessageCircle size={19} className="text-gold" />
                      WhatsApp
                    </a>
                    <a
                      href={telegramLink(settings.telegram)}
                      className="flex items-center gap-3 hover:text-gold-light"
                    >
                      <TelegramIcon size={19} className="text-gold" />
                      Telegram
                    </a>
                  </div>
                </div>
                <div className="border border-line/70 bg-card/70 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-light">
                    География
                  </p>
                  <p className="mt-3 flex items-center gap-3">
                    <MapPin size={19} className="text-gold" />
                    {settings.region}
                  </p>
                </div>
                <div className="border border-line/70 bg-card/70 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-light">
                    Время ответа
                  </p>
                  <p className="mt-3 flex items-center gap-3">
                    <ShieldCheck size={19} className="text-gold" />
                    Обычно отвечает в течение рабочего дня
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-line bg-card p-6 shadow-2xl shadow-black/10 md:p-8 lg:p-10">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        telegram={settings.telegram}
        email={settings.email}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
