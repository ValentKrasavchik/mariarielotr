"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { MediaUploadQueue } from "@/components/admin/media-upload-queue";
import {
  dealTypeOptions,
  objectTypeOptions,
  statusOptions,
} from "@/lib/constants";
import {
  createPropertyFormAction,
  type PropertyFormState,
} from "@/lib/admin-actions";

const initialFormState: PropertyFormState = {
  ok: false,
  message: "",
};

const steps = [
  {
    title: "Что добавляем",
    hint: "Выберите тип и укажите цену",
  },
  {
    title: "Где находится",
    hint: "Город, район и адрес",
  },
  {
    title: "Параметры",
    hint: "Площадь и основные характеристики",
  },
  {
    title: "Описание и фото",
    hint: "Текст для сайта и снимки объекта",
  },
] as const;

const renovationOptions = [
  "",
  "Без ремонта",
  "Косметический",
  "Евроремонт",
  "Дизайнерский",
];

const bathroomOptions = ["", "Совмещённый", "Раздельный", "2 и более"];

function SubmitButton({ uploadsBusy }: { uploadsBusy: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || uploadsBusy}
      className="min-h-14 w-full bg-gold px-6 py-4 text-base font-semibold text-graphite-deep hover:bg-gold-light disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[220px]"
    >
      {uploadsBusy
        ? "Дождитесь загрузки файлов..."
        : pending
          ? "Сохраняю..."
          : "Добавить на сайт"}
    </button>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-base font-medium text-cream">
        {label}
        {required ? <span className="text-gold-light"> *</span> : null}
      </span>
      {hint ? <span className="block text-sm leading-6 text-muted">{hint}</span> : null}
      {children}
    </label>
  );
}

const inputClassName =
  "h-14 w-full px-4 text-base text-cream placeholder:text-muted/70";

const selectClassName = "h-14 w-full px-4 text-base text-cream";

export function PropertyFormSimple() {
  const [state, formAction] = useActionState(
    createPropertyFormAction,
    initialFormState,
  );
  const [step, setStep] = useState(0);
  const [dealType, setDealType] = useState("sale");
  const [objectType, setObjectType] = useState("apartment");
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [uploadsBusy, setUploadsBusy] = useState(false);

  const isLastStep = step === steps.length - 1;

  function validateStep(index: number, form: HTMLFormElement) {
    const requiredByStep: Record<number, string[]> = {
      0: ["title", "price"],
      1: ["city", "district"],
      2: ["area"],
      3: ["description"],
    };

    for (const name of requiredByStep[index] ?? []) {
      const field = form.elements.namedItem(name);

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        if (!field.value.trim()) {
          field.focus();
          field.reportValidity?.();
          return false;
        }
      }
    }

    if (index === 0) {
      const priceField = form.elements.namedItem("price");
      const price =
        priceField instanceof HTMLInputElement
          ? Number(priceField.value)
          : Number.NaN;

      if (!Number.isFinite(price) || price <= 0) {
        setError("Укажите цену числом, например 3500000");
        return false;
      }
    }

    if (index === 3) {
      if (uploadsBusy) {
        setError("Подождите, пока все файлы загрузятся.");
        return false;
      }

      if (!imageUrls.length) {
        setError("Добавьте хотя бы одно фото — без фото объект не появится на сайте.");
        return false;
      }
    }

    setError("");
    return true;
  }

  function validateAll(form: HTMLFormElement) {
    for (let index = 0; index < steps.length; index += 1) {
      if (!validateStep(index, form)) {
        setStep(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
      }
    }

    return true;
  }

  function goNext(form: HTMLFormElement) {
    if (!validateStep(step, form)) {
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const progress = useMemo(
    () => Math.round(((step + 1) / steps.length) * 100),
    [step],
  );

  return (
    <div className="pb-28">
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <span>
            Шаг {step + 1} из {steps.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-graphite-deep">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div>
          <h2 className="serif-title text-2xl text-cream sm:text-3xl">
            {steps[step].title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">{steps[step].hint}</p>
        </div>
      </div>

      <form
        action={formAction}
        className="space-y-5"
        onSubmit={(event) => {
          if (!isLastStep) {
            event.preventDefault();
            goNext(event.currentTarget);
            return;
          }

          if (!validateAll(event.currentTarget)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="slug" value="" />
        <input type="hidden" name="currency" value="RUB" />
        <input type="hidden" name="sortOrder" value="0" />
        <input type="hidden" name="heroOrder" value="0" />
        <input type="hidden" name="dealType" value={dealType} />
        <input type="hidden" name="objectType" value={objectType} />

        <section className={step === 0 ? "space-y-5" : "hidden"}>
          <Field label="Продажа или аренда?" required>
            <div className="grid grid-cols-2 gap-3">
              {dealTypeOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDealType(value)}
                  className={`min-h-14 border px-4 py-3 text-base font-medium transition-colors ${
                    dealType === value
                      ? "border-gold bg-gold/15 text-gold-light"
                      : "border-line bg-graphite-deep/40 text-cream hover:border-gold/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Тип недвижимости" required>
            <div className="grid grid-cols-2 gap-3">
              {objectTypeOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setObjectType(value)}
                  className={`min-h-14 border px-3 py-3 text-sm font-medium leading-snug transition-colors sm:text-base ${
                    objectType === value
                      ? "border-gold bg-gold/15 text-gold-light"
                      : "border-line bg-graphite-deep/40 text-cream hover:border-gold/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="Заголовок на сайте"
            hint="Например: «2-комнатная квартира в центре, 54 м²»"
            required
          >
            <input
              name="title"
              required
              placeholder="Кратко, что за объект"
              className={inputClassName}
              autoComplete="off"
            />
          </Field>

          <Field
            label="Цена"
            hint="Только цифры, без пробелов и букв"
            required
          >
            <input
              name="price"
              type="number"
              inputMode="numeric"
              required
              min={1}
              placeholder="3500000"
              className={inputClassName}
            />
          </Field>
        </section>

        <section className={step === 1 ? "space-y-5" : "hidden"}>
          <Field label="Город" required>
            <input
              name="city"
              required
              defaultValue="Донецк"
              className={inputClassName}
            />
          </Field>

          <Field
            label="Район"
            hint="Например: Киевский, Ворошиловский"
            required
          >
            <input
              name="district"
              required
              placeholder="Название района"
              className={inputClassName}
            />
          </Field>

          <Field
            label="Адрес"
            hint="Можно указать улицу и дом — или оставить пустым"
          >
            <input
              name="address"
              placeholder="ул. Примерная, 10"
              className={inputClassName}
            />
          </Field>
        </section>

        <section className={step === 2 ? "space-y-5" : "hidden"}>
          <Field label="Площадь, м²" required>
            <input
              name="area"
              type="number"
              inputMode="decimal"
              step="0.1"
              required
              min={1}
              placeholder="54"
              className={inputClassName}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Комнат">
              <input
                name="rooms"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="2"
                className={inputClassName}
              />
            </Field>

            <Field label="Этаж">
              <input
                name="floor"
                type="number"
                inputMode="numeric"
                placeholder="5"
                className={inputClassName}
              />
            </Field>

            <Field label="Этажей в доме">
              <input
                name="floors"
                type="number"
                inputMode="numeric"
                placeholder="9"
                className={inputClassName}
              />
            </Field>

            <Field label="Год постройки">
              <input
                name="builtYear"
                type="number"
                inputMode="numeric"
                placeholder="1985"
                className={inputClassName}
              />
            </Field>
          </div>

          <Field label="Санузел">
            <select name="bathroom" defaultValue="" className={selectClassName}>
              {bathroomOptions.map((option) => (
                <option key={option || "empty"} value={option}>
                  {option || "Не указано"}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ремонт">
            <select name="renovation" defaultValue="" className={selectClassName}>
              {renovationOptions.map((option) => (
                <option key={option || "empty"} value={option}>
                  {option || "Не указано"}
                </option>
              ))}
            </select>
          </Field>
        </section>

        <section className={step === 3 ? "space-y-5" : "hidden"}>
          <Field
            label="Описание для сайта"
            hint="Простыми словами: планировка, состояние, что рядом"
            required
          >
            <textarea
              name="description"
              required
              rows={6}
              placeholder="Опишите объект так, как рассказали бы клиенту по телефону"
              className="min-h-[160px] w-full px-4 py-3 text-base leading-7 text-cream placeholder:text-muted/70"
            />
          </Field>

          <Field
            label="Плюсы объекта"
            hint="Каждый пункт — с новой строки. Например: «Тихый двор», «Рядом школа»"
          >
            <textarea
              name="benefits"
              rows={4}
              placeholder={"Тихий двор\nЗакрытая парковка\nСвежий ремонт"}
              className="min-h-[120px] w-full px-4 py-3 text-base leading-7 text-cream placeholder:text-muted/70"
            />
          </Field>

          <Field
            label="Фото и видео"
            hint="Загрузка идёт сразу, по одному файлу. Размер не ограничен."
            required
          >
            <MediaUploadQueue
              imageUrls={imageUrls}
              videoUrls={videoUrls}
              onImageUrlsChange={setImageUrls}
              onVideoUrlsChange={setVideoUrls}
              onBusyChange={setUploadsBusy}
            />
          </Field>

          <div className="space-y-4 border border-line bg-card/60 p-4">
            <Field label="Статус объекта">
              <select name="status" defaultValue="actual" className={selectClassName}>
                {statusOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <label className="flex min-h-14 cursor-pointer items-center gap-4 border border-line bg-graphite-deep/40 px-4">
              <input
                name="isPublished"
                type="checkbox"
                defaultChecked
                className="size-5 w-5 shrink-0"
              />
              <span className="text-base leading-snug text-cream">
                Сразу показать на сайте
              </span>
            </label>

            <details>
              <summary className="cursor-pointer text-sm text-muted hover:text-gold-light">
                Дополнительные настройки
              </summary>
              <label className="mt-4 flex min-h-14 cursor-pointer items-center gap-4 border border-line bg-graphite-deep/40 px-4">
                <input
                  name="showInHero"
                  type="checkbox"
                  className="size-5 w-5 shrink-0"
                />
                <span className="text-sm leading-snug text-cream">
                  Показывать в большом блоке на главной
                </span>
              </label>
            </details>
          </div>
        </section>

        {error || state.message ? (
          <p className="border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-6 text-gold-light">
            {error || state.message}
          </p>
        ) : null}

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-graphite/95 px-4 py-4 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-lg flex-col-reverse gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="min-h-14 w-full border border-line px-6 py-4 text-base text-cream hover:border-gold hover:text-gold-light sm:w-auto"
              >
                Назад
              </button>
            ) : (
              <div className="hidden sm:block sm:flex-1" />
            )}

            {!isLastStep ? (
              <button
                type="button"
                onClick={(event) => {
                  const form = event.currentTarget.closest("form");
                  if (form instanceof HTMLFormElement) {
                    goNext(form);
                  }
                }}
                className="min-h-14 w-full bg-gold px-6 py-4 text-base font-semibold text-graphite-deep hover:bg-gold-light sm:ml-auto sm:w-auto sm:min-w-[220px]"
              >
                Далее
              </button>
            ) : (
              <SubmitButton uploadsBusy={uploadsBusy} />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
