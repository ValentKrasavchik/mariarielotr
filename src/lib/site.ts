import { prisma } from "@/lib/prisma";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://mariarieltor.ru";

export const defaultSettings = {
  phone: "+7 949 305-39-00",
  whatsapp: "79493053900",
  telegram: "maria_rieltor",
  email: "hello@mariarieltor.ru",
  heroTitle: "Мария Риелтор",
  heroSubtitle: "Недвижимость с заботой о результате",
  heroText:
    "Помогаю безопасно купить, продать или подобрать недвижимость в Донецке и Донецкой области - от первой консультации до завершения сделки.",
  aboutText:
    "Мария помогает клиентам безопасно покупать, продавать и подбирать недвижимость. В работе важны прозрачность, внимательность к деталям и спокойное сопровождение клиента на каждом этапе сделки.",
  seoTitle: "Мария Риелтор - недвижимость в Донецке и Донецкой области",
  seoDescription:
    "Персональный сайт риелтора Марии: актуальные объекты, сопровождение покупки и продажи недвижимости, консультации по рынку.",
  workTime: "Ежедневно с 10:00 до 20:00",
  region: "Донецк и Донецкая область",
};

export async function getSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return settings ?? defaultSettings;
}

export function whatsappLink(phone: string, text = "Здравствуйте, хочу получить консультацию по недвижимости") {
  const normalized = phone.replace(/\D/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export function telegramLink(username: string) {
  return `https://t.me/${username.replace(/^@/, "")}`;
}
