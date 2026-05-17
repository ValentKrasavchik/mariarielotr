export function formatPrice(price: number, currency = "RUB", dealType?: string) {
  const formatted = new Intl.NumberFormat("ru-RU").format(price);
  const suffix = currency === "RUB" ? "₽" : currency;
  const rentSuffix = dealType === "rent" ? " / мес." : "";

  return `${formatted} ${suffix}${rentSuffix}`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function splitLines(value?: string | null) {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function compactAddress(city: string, district: string) {
  return [city, district].filter(Boolean).join(", ");
}
