import Link from "next/link";
import { Building2, Inbox, MessageSquareText, Settings } from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";

const nav = [
  { href: "/admin/objects", label: "Объекты", icon: Building2 },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquareText },
  { href: "/admin/leads", label: "Заявки", icon: Inbox },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminNav() {
  return (
    <aside className="border-b border-line bg-graphite-deep lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-6 p-5">
        <Link href="/admin" className="serif-title text-2xl text-cream">
          Мария Риелтор
        </Link>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-3 border border-transparent px-4 py-3 text-sm text-muted hover:border-line hover:text-gold-light"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden lg:block">
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
