import { Phone } from "lucide-react";
import { updateLeadStatus } from "@/lib/admin-actions";
import {
  getLabel,
  leadStatusLabels,
  leadStatusOptions,
  requestTypeLabels,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true, slug: true } } },
  });

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-gold-light">
        Заявки
      </p>
      <h1 className="mt-3 serif-title text-4xl text-cream">Заявки с сайта</h1>

      <div className="mt-8 space-y-4">
        {leads.length ? (
          leads.map((lead) => (
            <article key={lead.id} className="border border-line bg-card p-5 md:p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_1fr_220px] lg:items-start">
                <div>
                  <p className="text-xl font-semibold text-cream">{lead.name}</p>
                  <a
                    href={`tel:${lead.phone.replace(/\D/g, "")}`}
                    className="mt-2 inline-flex items-center gap-2 text-gold-light"
                  >
                    <Phone size={17} />
                    {lead.phone}
                  </a>
                  <p className="mt-3 text-sm text-muted">
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted">
                  <p>
                    Тип запроса:{" "}
                    <span className="text-cream">
                      {getLabel(requestTypeLabels, lead.requestType)}
                    </span>
                  </p>
                  {lead.property ? (
                    <p>
                      Объект:{" "}
                      <span className="text-cream">{lead.property.title}</span>
                    </p>
                  ) : null}
                  {lead.comment ? <p className="leading-6">{lead.comment}</p> : null}
                </div>
                <form action={updateLeadStatus.bind(null, lead.id)} className="space-y-3">
                  <label className="block space-y-2 text-sm text-muted">
                    <span>Статус</span>
                    <select name="status" defaultValue={lead.status} className="h-12 px-4">
                      {leadStatusOptions.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="w-full border border-line px-4 py-3 text-sm text-muted hover:border-gold hover:text-gold-light">
                    Сохранить статус
                  </button>
                  <p className="text-xs text-muted">
                    Сейчас: {getLabel(leadStatusLabels, lead.status)}
                  </p>
                </form>
              </div>
            </article>
          ))
        ) : (
          <div className="border border-line bg-card p-10 text-center text-muted">
            Заявок пока нет.
          </div>
        )}
      </div>
    </div>
  );
}
