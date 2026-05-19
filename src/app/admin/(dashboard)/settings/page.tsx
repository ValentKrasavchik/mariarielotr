import { updateSettings } from "@/lib/admin-actions";
import { getSettings } from "@/lib/site";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.24em] text-gold-light">
        Настройки
      </p>
      <h1 className="mt-3 serif-title text-4xl text-cream">
        Настройки сайта
      </h1>

      <form action={updateSettings} className="mt-8 space-y-8">
        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Контакты</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input name="phone" defaultValue={settings.phone} placeholder="Телефон" className="h-12 px-4" />
            <input name="whatsapp" defaultValue={settings.whatsapp} placeholder="WhatsApp" className="h-12 px-4" />
            <input name="telegram" defaultValue={settings.telegram} placeholder="Telegram" className="h-12 px-4" />
            <input name="maxMessenger" defaultValue={settings.maxMessenger} placeholder="MAX: username или ссылка" className="h-12 px-4" />
            <input name="email" defaultValue={settings.email} placeholder="Email" className="h-12 px-4" />
            <input name="workTime" defaultValue={settings.workTime} placeholder="Время работы" className="h-12 px-4" />
            <input name="region" defaultValue={settings.region} placeholder="Регион работы" className="h-12 px-4" />
          </div>
        </section>

        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">Главная страница</h2>
          <div className="mt-5 grid gap-4">
            <input name="heroTitle" defaultValue={settings.heroTitle} placeholder="Название в hero" className="h-12 px-4" />
            <input name="heroSubtitle" defaultValue={settings.heroSubtitle} placeholder="Подзаголовок hero" className="h-12 px-4" />
            <textarea name="heroText" defaultValue={settings.heroText} placeholder="Описание hero" className="px-4 py-3" />
            <textarea name="aboutText" defaultValue={settings.aboutText} placeholder="Текст Обо мне" className="px-4 py-3" />
          </div>
        </section>

        <section className="border border-line bg-card p-5 md:p-6">
          <h2 className="serif-title text-2xl text-cream">SEO</h2>
          <div className="mt-5 grid gap-4">
            <input name="seoTitle" defaultValue={settings.seoTitle} placeholder="SEO title" className="h-12 px-4" />
            <textarea name="seoDescription" defaultValue={settings.seoDescription} placeholder="SEO description" className="px-4 py-3" />
          </div>
        </section>

        <button className="bg-gold px-7 py-4 font-semibold text-graphite-deep hover:bg-gold-light">
          Сохранить настройки
        </button>
      </form>
    </div>
  );
}
