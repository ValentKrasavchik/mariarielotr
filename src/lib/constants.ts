export const PHONE = "+7 949 305-39-00";

export const dealTypeLabels: Record<string, string> = {
  sale: "Продажа",
  rent: "Аренда",
};

export const objectTypeLabels: Record<string, string> = {
  apartment: "Квартира",
  house: "Дом",
  land: "Участок",
  commercial: "Коммерция",
};

export const statusLabels: Record<string, string> = {
  actual: "Актуально",
  sold: "Продано",
  rented: "Сдано",
  archive: "Архив",
};

export const leadStatusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  closed: "Закрыта",
};

export const requestTypeLabels: Record<string, string> = {
  buy: "Купить недвижимость",
  sell: "Продать недвижимость",
  selection: "Подобрать объект",
  evaluation: "Оценить недвижимость",
  consultation: "Получить консультацию",
  support: "Сопровождение сделки",
  object: "Вопрос по объекту",
};

export const contactRequestTypeOptions = [
  ["buy", requestTypeLabels.buy],
  ["sell", requestTypeLabels.sell],
  ["selection", requestTypeLabels.selection],
  ["evaluation", requestTypeLabels.evaluation],
  ["consultation", requestTypeLabels.consultation],
  ["support", requestTypeLabels.support],
] as const;

export const dealTypeOptions = Object.entries(dealTypeLabels);
export const objectTypeOptions = Object.entries(objectTypeLabels);
export const statusOptions = Object.entries(statusLabels);
export const leadStatusOptions = Object.entries(leadStatusLabels);
export const requestTypeOptions = contactRequestTypeOptions;

export function getLabel(labels: Record<string, string>, value?: string | null) {
  if (!value) {
    return "Не указано";
  }

  return labels[value] ?? value;
}
