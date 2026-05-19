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
} from "lucide-react";
import { MaxIcon } from "@/components/icons/max-icon";
import { TelegramIcon } from "@/components/icons/telegram-icon";
import { LeadForm } from "@/components/lead-form";
import { PropertyCard } from "@/components/property-card";
import { ReviewForm } from "@/components/review-form";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import { compactAddress, formatDate, formatPrice } from "@/lib/format";
import {
  getSettings,
  maxMessengerLink,
  siteUrl,
  telegramLink,
  whatsappLink,
} from "@/lib/site";

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
    text: "Готовлю объект к продаже, показываю сильные стороны и веду переговоры по цене.",
  },
  {
    icon: KeyRound,
    title: "Покупка квартиры",
    text: "Подбираю варианты, проверяю документы и сопровождаю вас до регистрации.",
  },
  {
    icon: Search,
    title: "Подбор объекта",
    text: "Отбираю объекты под вашу задачу, бюджет, район и привычный сценарий жизни.",
  },
  {
    icon: ClipboardCheck,
    title: "Сопровождение сделки",
    text: "Лично контролирую этапы, коммуникацию, сроки и юридически важные детали.",
  },
  {
    icon: Scale,
    title: "Оценка недвижимости",
    text: "Помогаю определить реалистичную цену с учетом рынка, состояния объекта и спроса.",
  },
  {
    icon: MessageCircle,
    title: "Консультация по рынку",
    text: "Объясняю ситуацию на рынке простым языком и предлагаю понятный следующий шаг.",
  },
];

const steps = [
  {
    title: "Консультация",
    text: "Я выслушиваю вашу задачу, уточняю бюджет, сроки и формат помощи.",
  },
  {
    title: "Анализ задачи",
    text: "Проверяю ситуацию, объект, документы и заранее объясняю возможные риски.",
  },
  {
    title: "Подбор или подготовка объекта",
    text: "Подбираю подходящие варианты или готовлю ваш объект к продаже.",
  },
  {
    title: "Показы и переговоры",
    text: "Организую просмотры и веду переговоры в ваших интересах.",
  },
  {
    title: "Сопровождение сделки",
    text: "Остаюсь рядом и контролирую этапы сделки до финального результата.",
  },
];

const facts = [
  {
    number: "01",
    icon: Search,
    title: "Личная стратегия под вашу задачу",
    text: "Я отталкиваюсь от вашей цели, бюджета и реальной ситуации на рынке.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Проверка документов без сложных слов",
    text: "Заранее объясняю риски понятным языком, чтобы вы принимали решения спокойно.",
  },
  {
    number: "03",
    icon: Scale,
    title: "Переговоры в ваших интересах",
    text: "Защищаю цену, сроки и условия сделки на каждом этапе.",
  },
  {
    number: "04",
    icon: BadgeCheck,
    title: "Я рядом до финального оформления",
    text: "Не передаю вас между менеджерами: веду сделку лично и остаюсь на связи.",
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
      take: 10,
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
          className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-cover bg-center"
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
                <div className="mt-3 grid gap-3 min-[480px]:grid-cols-3">
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
                  <a
                    href={maxMessengerLink(settings.maxMessenger)}
                    className="inline-flex items-center justify-center gap-2 border border-line bg-graphite-deep/20 px-4 py-3 text-sm font-semibold text-cream hover:border-gold-light hover:bg-gold/10 hover:text-gold-light"
                  >
                    <MaxIcon size={17} className="text-gold" />
                    MAX
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
              <Image
                src="/maria-about.png"
                alt="Мария, персональный риелтор"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[center_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-deep/80 via-graphite-deep/20 to-transparent" />
              <div className="absolute inset-6 border border-line" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="border-l border-gold-light/70 pl-5">
                  <p className="serif-title text-3xl text-cream">
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
                Обо мне
              </p>
              <h2 className="mt-4 serif-title text-4xl leading-tight text-cream sm:text-5xl">
                Я лично сопровождаю сделки, где важны документы, цена и доверие
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                {settings.aboutText}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Опытная оценка рыночной ситуации",
                  "Внимание к юридическим деталям",
                  "Бережная коммуникация с клиентом",
                  "Мое личное участие до результата",
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
          className="services-section relative isolate overflow-hidden bg-graphite-deep py-20 md:py-24"
        >
          <div className="section-shell relative z-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                Услуги
              </p>
              <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                Помогаю с недвижимостью от первого вопроса до сделки
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
                  Показываю каждый шаг без лишней суеты
                </h2>
                <p className="mt-5 max-w-md leading-7 text-muted">
                  Я объясняю, что происходит сейчас, какой следующий шаг и где
                  важно принять решение.
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
                  Личная работа, а не поток клиентов
                </h2>
                <p className="mt-5 max-w-md leading-7 text-muted">
                  Для меня важны не только найденный объект или покупатель, но и
                  ваше спокойствие в процессе.
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

        <section id="reviews" className="bg-graphite-deep py-24">
          <div className="section-shell">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:items-start">
              <div className="max-w-2xl xl:col-start-1 xl:row-start-1">
                <p className="text-sm uppercase tracking-[0.28em] text-gold-light">
                  Отзывы
                </p>
                <h2 className="mt-4 serif-title text-4xl text-cream sm:text-5xl">
                  Клиенты ценят мой спокойный и понятный подход
                </h2>
              </div>
              <div className="min-w-0 xl:col-start-1 xl:row-start-2">
                <ReviewsCarousel
                  reviews={reviews.map((review) => ({
                    id: review.id,
                    clientName: review.clientName,
                    text: review.text,
                    rating: review.rating,
                    date: formatDate(review.date),
                  }))}
                />
              </div>
              <div className="border border-line bg-card p-6 md:p-8 xl:col-start-2 xl:row-start-2 xl:h-[470px] xl:p-6">
                <p className="text-sm uppercase tracking-[0.22em] text-gold-light">
                  Оставить отзыв
                </p>
                <h3 className="mt-3 serif-title text-2xl leading-tight text-cream">
                  Поделитесь впечатлением о работе со мной
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Отзыв появится на сайте после проверки.
                </p>
                <div className="mt-5">
                  <ReviewForm compact />
                </div>
              </div>
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
                Расскажите мне о вашей задаче по недвижимости
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-muted">
                Оставьте заявку - я свяжусь с вами, уточню детали и предложу
                следующий шаг.
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
                    <a
                      href={maxMessengerLink(settings.maxMessenger)}
                      className="flex items-center gap-3 hover:text-gold-light"
                    >
                      <MaxIcon size={19} className="text-gold" />
                      MAX
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
