import Link from "next/link";
import { ArrowRight, Building2, Inbox, MessageSquareText } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [objects, leads, reviews, newLeads] = await Promise.all([
    prisma.property.count(),
    prisma.lead.count(),
    prisma.review.count(),
    prisma.lead.count({ where: { status: "new" } }),
  ]);

  const cards = [
    { label: "Объекты", value: objects, href: "/admin/objects", icon: Building2 },
    { label: "Заявки", value: leads, href: "/admin/leads", icon: Inbox },
    { label: "Новые заявки", value: newLeads, href: "/admin/leads", icon: Inbox },
    { label: "Отзывы", value: reviews, href: "/admin/reviews", icon: MessageSquareText },
  ];

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-gold-light">
        Админ-панель
      </p>
      <h1 className="mt-3 serif-title text-4xl text-cream">
        Управление сайтом
      </h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-line bg-card p-6 hover:border-gold">
            <card.icon className="text-gold" size={26} />
            <p className="mt-5 serif-title text-5xl text-gold-light">
              {card.value}
            </p>
            <p className="mt-2 flex items-center justify-between text-muted">
              {card.label}
              <ArrowRight size={17} />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
