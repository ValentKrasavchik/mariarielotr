"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import {
  createPublicReviewAction,
  type ReviewFormState,
} from "@/lib/actions";

const initialState: ReviewFormState = {
  ok: false,
  message: "",
};

type ReviewFormProps = {
  compact?: boolean;
};

export function ReviewForm({ compact = false }: ReviewFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createPublicReviewAction,
    initialState,
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className={compact ? "grid gap-3" : "grid gap-4"}>
      <div className={compact ? "grid gap-3 sm:grid-cols-[1fr_130px]" : "grid gap-4 sm:grid-cols-[1fr_150px]"}>
        <label className="space-y-2 text-sm text-muted">
          <span>Ваше имя</span>
          <input
            name="clientName"
            required
            placeholder="Например, Анна"
            className={compact ? "h-11 px-3" : "h-12 px-4"}
            aria-invalid={Boolean(state.errors?.clientName)}
          />
          {state.errors?.clientName?.[0] ? (
            <span className="block text-xs text-gold-light/85">
              {state.errors.clientName[0]}
            </span>
          ) : null}
        </label>

        <label className="space-y-2 text-sm text-muted">
          <span>Оценка</span>
          <select
            name="rating"
            defaultValue="5"
            className={compact ? "h-11 px-3" : "h-12 px-4"}
            aria-invalid={Boolean(state.errors?.rating)}
          >
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
          {state.errors?.rating?.[0] ? (
            <span className="block text-xs text-gold-light/85">
              {state.errors.rating[0]}
            </span>
          ) : null}
        </label>
      </div>

      <label className="space-y-2 text-sm text-muted">
        <span>Отзыв</span>
        <textarea
          name="text"
          required
          placeholder="Напишите пару слов о работе со мной"
        className={compact ? "h-24 px-3 py-3" : "min-h-32 px-4 py-3"}
          aria-invalid={Boolean(state.errors?.text)}
        />
        {state.errors?.text?.[0] ? (
          <span className="block text-xs text-gold-light/85">
            {state.errors.text[0]}
          </span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-3 font-semibold text-graphite-deep hover:bg-gold-light disabled:cursor-wait disabled:opacity-70"
      >
        <Send size={18} />
        {pending ? "Отправляю..." : "Отправить отзыв"}
      </button>

      {!compact ? (
        <p className="text-xs leading-5 text-muted">
          Отзыв появится на сайте после проверки.
        </p>
      ) : null}

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
