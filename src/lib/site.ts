import { prisma } from "@/lib/prisma";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://mariarieltor.ru";

export const defaultSettings = {
  phone: "+7 949 305-39-00",
  whatsapp: "79493053900",
  telegram: "maria_rieltor",
  maxMessenger: "maria_rieltor",
  email: "hello@mariarieltor.ru",
  heroTitle: "Мария Риелтор",
  heroSubtitle: "Я помогу спокойно решить вопрос с недвижимостью",
  heroText:
    "Лично помогаю купить, продать или подобрать недвижимость в Донецке и Донецкой области - от первой консультации до завершения сделки.",
  aboutText:
    "Я работаю как персональный риелтор: разбираю вашу ситуацию, объясняю риски простым языком и сопровождаю сделку лично. Для меня важны прозрачность, внимательность к деталям и спокойная коммуникация на каждом этапе.",
  seoTitle: "Мария Риелтор - недвижимость в Донецке и Донецкой области",
  seoDescription:
    "Личный сайт риелтора Марии: актуальные объекты, сопровождение покупки и продажи недвижимости, консультации по рынку.",
  workTime: "Ежедневно с 10:00 до 20:00",
  region: "Донецк и Донецкая область",
};

type SiteSettingsView = typeof defaultSettings;

export async function getSettings() {
  const settings = await prisma.$queryRaw<SiteSettingsView[]>`
    SELECT
      phone,
      whatsapp,
      telegram,
      maxMessenger,
      email,
      heroTitle,
      heroSubtitle,
      heroText,
      aboutText,
      seoTitle,
      seoDescription,
      workTime,
      region
    FROM SiteSettings
    LIMIT 1
  `;

  return settings[0] ?? defaultSettings;
}

export function whatsappLink(phone: string, text = "Здравствуйте, хочу получить консультацию по недвижимости") {
  const normalized = phone.replace(/\D/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export function telegramLink(username: string) {
  return `https://t.me/${username.replace(/^@/, "")}`;
}

export function maxMessengerLink(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://max.ru/${value.replace(/^@|^\//, "")}`;
}
