import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

type SiteHeaderProps = {
  phone: string;
};

export function SiteHeader({ phone }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-graphite/88 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-3 sm:gap-5 lg:gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden border border-line bg-black/30 sm:size-11">
            <Image
              src="/logo-m-real-estate.png"
              alt="Логотип Мария Риелтор"
              width={44}
              height={44}
              className="size-full object-cover"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate serif-title text-lg text-cream sm:text-xl">
              Мария Риелтор
            </span>
            <span className="hidden text-xs uppercase tracking-[0.22em] text-muted sm:block">
              недвижимость · Донецк и область
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted lg:flex">
          <Link href="/#about" className="hover:text-gold-light">
            Обо мне
          </Link>
          <Link href="/#services" className="hover:text-gold-light">
            Услуги
          </Link>
          <Link href="/objects" className="hover:text-gold-light">
            Объекты
          </Link>
          <Link href="/#reviews" className="hover:text-gold-light">
            Отзывы
          </Link>
          <Link href="/#contacts" className="hover:text-gold-light">
            Контакты
          </Link>
        </nav>

        <a
          href={`tel:${phone.replace(/\D/g, "")}`}
          className="inline-flex shrink-0 items-center gap-2 border border-line px-3 py-3 text-sm font-medium text-cream hover:border-gold hover:text-gold-light sm:px-4"
        >
          <Phone size={17} />
          <span className="hidden sm:inline">{phone}</span>
        </a>
      </div>
    </header>
  );
}
