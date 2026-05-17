"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { createLeadAction, type LeadFormState } from "@/lib/actions";
import { contactRequestTypeOptions } from "@/lib/constants";

type LeadFormProps = {
  propertyId?: string;
  compact?: boolean;
};

const initialState: LeadFormState = {
  ok: false,
  message: "",
};

export function LeadForm({ propertyId, compact = false }: LeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createLeadAction,
    initialState,
  );
  const requestTypeOptions = propertyId
    ? ([["object", "Вопрос по объекту"], ...contactRequestTypeOptions] as const)
    : contactRequestTypeOptions;

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {propertyId ? (
        <input type="hidden" name="propertyId" value={propertyId} />
      ) : null}

      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <label className="space-y-2 text-sm text-muted">
          <span>Имя</span>
          <input
            name="name"
            required
            placeholder="Ваше имя"
            className="h-12 px-4"
            aria-invalid={Boolean(state.errors?.name)}
          />
          {state.errors?.name?.[0] ? (
            <span className="block text-xs text-gold-light/85">
              {state.errors.name[0]}
            </span>
          ) : null}
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Телефон</span>
          <input
            name="phone"
            required
            inputMode="tel"
            placeholder="+7 ..."
            className="h-12 px-4"
            aria-invalid={Boolean(state.errors?.phone)}
          />
          {state.errors?.phone?.[0] ? (
            <span className="block text-xs text-gold-light/85">
              {state.errors.phone[0]}
            </span>
          ) : null}
        </label>
      </div>

      <label className="block space-y-2 text-sm text-muted">
        <span>Что вас интересует?</span>
        <select
          name="requestType"
          required
          className="h-12 px-4"
          defaultValue={propertyId ? "object" : "consultation"}
          aria-invalid={Boolean(state.errors?.requestType)}
        >
          {requestTypeOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {state.errors?.requestType?.[0] ? (
          <span className="block text-xs text-gold-light/85">
            {state.errors.requestType[0]}
          </span>
        ) : null}
      </label>

      <label className="block space-y-2 text-sm text-muted">
        <span>Комментарий</span>
        <textarea
          name="comment"
          placeholder="Кратко опишите задачу: район, бюджет, тип объекта или срок сделки."
          className="px-4 py-3"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 border border-gold-light/70 bg-gold px-6 py-4 font-semibold text-graphite-deep hover:bg-gold-light disabled:cursor-wait disabled:opacity-70"
      >
        <Send size={18} />
        {pending ? "Отправляем..." : "Отправить заявку"}
      </button>

      <p className="text-xs leading-5 text-muted">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>

      {state.message ? (
        <p
          className={`border px-4 py-3 text-sm ${
            state.ok
              ? "border-gold/50 bg-gold/10 text-gold-light"
              : "border-line bg-graphite-deep/45 text-cream"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
