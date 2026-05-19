import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { MaxIcon } from "@/components/icons/max-icon";
import { TelegramIcon } from "@/components/icons/telegram-icon";
import { maxMessengerLink, telegramLink, whatsappLink } from "@/lib/site";

type SiteFooterProps = {
  phone: string;
  whatsapp: string;
  telegram: string;
  maxMessenger: string;
  email: string;
};

export function SiteFooter({
  phone,
  whatsapp,
  telegram,
  maxMessenger,
  email,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-line bg-graphite-deep">
      <div className="section-shell grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="serif-title text-2xl text-cream">
            Мария Риелтор
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">
            Я лично сопровождаю покупку, продажу и подбор недвижимости в
            Донецке и Донецкой области.
          </p>
        </div>

        <div className="space-y-3 text-sm text-muted">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-light">
            Навигация
          </p>
          <Link href="/objects" className="block hover:text-gold-light">
            Актуальные объекты
          </Link>
          <Link href="/#services" className="block hover:text-gold-light">
            Услуги
          </Link>
          <Link href="/#contacts" className="block hover:text-gold-light">
            Оставить заявку
          </Link>
        </div>

        <div className="space-y-3 text-sm text-muted">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-light">
            Связь
          </p>
          <a href={`tel:${phone.replace(/\D/g, "")}`} className="flex gap-2 hover:text-gold-light">
            <Phone size={16} />
            {phone}
          </a>
          <a href={whatsappLink(whatsapp)} className="flex gap-2 hover:text-gold-light">
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a href={telegramLink(telegram)} className="flex gap-2 hover:text-gold-light">
            <TelegramIcon size={16} className="text-gold" />
            Telegram
          </a>
          <a href={maxMessengerLink(maxMessenger)} className="flex gap-2 hover:text-gold-light">
            <MaxIcon size={16} className="text-gold" />
            MAX
          </a>
          <a href={`mailto:${email}`} className="block hover:text-gold-light">
            {email}
          </a>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <div className="section-shell text-xs text-muted">
          <span>© 2026 Мария Риелтор. Все права защищены.</span>
        </div>
      </div>
    </footer>
  );
}
