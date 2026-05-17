"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requestTypeLabels } from "@/lib/constants";

const leadSchema = z.object({
  name: z.string().min(2, "Укажите имя"),
  phone: z
    .string()
    .min(1, "Укажите телефон")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Укажите корректный телефон",
    ),
  requestType: z
    .string()
    .min(1, "Выберите тип обращения")
    .refine((value) => value in requestTypeLabels, "Выберите тип обращения"),
  comment: z.string().optional(),
  propertyId: z.string().optional(),
});

export type LeadFormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramLeadNotification(lead: {
  name: string;
  phone: string;
  requestType: string;
  comment: string | null;
  property: { title: string; slug: string } | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const lines = [
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Тип:</b> ${escapeHtml(requestTypeLabels[lead.requestType] ?? lead.requestType)}`,
  ];

  if (lead.property) {
    lines.push(`<b>Объект:</b> ${escapeHtml(lead.property.title)}`);
  }

  if (lead.comment) {
    lines.push("", `<b>Комментарий:</b> ${escapeHtml(lead.comment)}`);
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  }).catch(() => undefined);
}

export async function createLeadAction(
  _state: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    requestType: String(formData.get("requestType") ?? "").trim(),
    comment: String(formData.get("comment") ?? "").trim(),
    propertyId: String(formData.get("propertyId") ?? "").trim(),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Проверьте данные формы",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        requestType: data.requestType,
        comment: data.comment || null,
        propertyId: data.propertyId || null,
      },
      include: {
        property: { select: { title: true, slug: true } },
      },
    });

    await sendTelegramLeadNotification(lead);
  } catch {
    return {
      ok: false,
      message:
        "Не удалось отправить заявку. Попробуйте еще раз или свяжитесь по телефону.",
    };
  }

  revalidatePath("/admin/leads");

  return {
    ok: true,
    message: "Заявка отправлена. Мария свяжется с вами в ближайшее время.",
  };
}
