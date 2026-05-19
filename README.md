# Мария Риелтор

Личный сайт риелтора Марии для домена `mariarieltor.ru`: публичный каталог объектов, детальные страницы недвижимости, форма заявок и защищенная админ-панель.

## Стек

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma ORM
- SQLite для локальной разработки
- NextAuth/Auth.js credentials-login для `/admin`
- Server Actions для заявок, CRUD и загрузки фото

## Быстрый старт

1. Установите зависимости:

```bash
npm install
```

2. Создайте `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-long-random-secret"
NEXT_PUBLIC_SITE_URL="https://mariarieltor.ru"
ADMIN_EMAIL="admin@mariarieltor.ru"
ADMIN_PASSWORD="admin12345"
```

3. Подготовьте базу:

```bash
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

Если проект лежит в Windows-папке с кириллицей и `prisma migrate dev` падает из-за schema engine, используйте локальный обход:

```bash
npm run db:apply
npm run db:seed
```

4. Запустите сайт:

```bash
npm run dev
```

Сайт откроется на `http://localhost:3000`. Админка: `http://localhost:3000/admin`.

## Администратор

Администратор создается seed-скриптом из переменных:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

После первого запуска смените пароль в `.env` и повторно выполните `npm run db:seed`, либо обновите запись напрямую через Prisma Studio:

```bash
npm run db:studio
```

## Основные разделы

- `/` - главная страница
- `/objects` - каталог с фильтрами
- `/objects/[slug]` - детальная страница объекта
- `/admin` - защищенная панель
- `/admin/objects` - CRUD объектов и загрузка фото
- `/admin/reviews` - CRUD отзывов
- `/admin/leads` - заявки и статусы
- `/admin/settings` - контакты, тексты hero/about и SEO

## Изображения

Фото объектов можно добавлять в админке:

- загрузкой файлов с компьютера
- вставкой URL изображений

Локальные файлы сохраняются в `public/uploads/properties`. Для production на serverless-хостинге лучше заменить локальную загрузку на S3, Cloudflare R2 или другое постоянное хранилище.

## SEO

Уже добавлено:

- `title` и `description` для главной
- SEO-поля для объектов
- Open Graph
- `sitemap.xml`
- `robots.txt`
- базовая JSON-LD микроразметка `RealEstateAgent`

## Сборка

```bash
npm run lint
npm run build
npm run start
```

Скрипты `dev` и `build` запускают Next.js через webpack, потому что Turbopack в текущей версии может падать на Windows-путях с кириллицей.

## Деплой

Для VPS:

1. Установите Node.js 22+.
2. Скопируйте проект и настройте `.env`.
3. Выполните `npm ci`.
4. Выполните `npm run prisma:generate`, `npm run db:migrate`, `npm run db:seed`.
5. Выполните `npm run build`.
6. Запустите `npm run start` под процесс-менеджером.

Для PostgreSQL:

1. В `prisma/schema.prisma` замените `provider = "sqlite"` на `provider = "postgresql"`.
2. Укажите PostgreSQL `DATABASE_URL`.
3. Выполните `npm run db:migrate` и `npm run db:seed`.
