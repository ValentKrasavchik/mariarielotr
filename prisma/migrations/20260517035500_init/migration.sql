-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "dealType" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'actual',
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT,
    "area" REAL NOT NULL,
    "rooms" INTEGER,
    "floor" INTEGER,
    "floors" INTEGER,
    "bathroom" TEXT,
    "renovation" TEXT,
    "builtYear" INTEGER,
    "description" TEXT NOT NULL,
    "benefits" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "propertyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "photo" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "propertyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL DEFAULT '+7 949 305-39-00',
    "whatsapp" TEXT NOT NULL DEFAULT '79493053900',
    "telegram" TEXT NOT NULL DEFAULT 'maria_rieltor',
    "email" TEXT NOT NULL DEFAULT 'hello@mariarieltor.ru',
    "heroTitle" TEXT NOT NULL DEFAULT 'Мария Риелтор',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Я помогу спокойно решить вопрос с недвижимостью',
    "heroText" TEXT NOT NULL DEFAULT 'Лично помогаю купить, продать или подобрать недвижимость в Донецке и Донецкой области - от первой консультации до завершения сделки.',
    "aboutText" TEXT NOT NULL DEFAULT 'Я работаю как персональный риелтор: разбираю вашу ситуацию, объясняю риски простым языком и сопровождаю сделку лично. Для меня важны прозрачность, внимательность к деталям и спокойная коммуникация на каждом этапе.',
    "seoTitle" TEXT NOT NULL DEFAULT 'Мария Риелтор - недвижимость в Донецке и Донецкой области',
    "seoDescription" TEXT NOT NULL DEFAULT 'Личный сайт риелтора Марии: актуальные объекты, сопровождение покупки и продажи недвижимости, консультации по рынку.',
    "workTime" TEXT NOT NULL DEFAULT 'Ежедневно с 10:00 до 20:00',
    "region" TEXT NOT NULL DEFAULT 'Донецк и Донецкая область',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE INDEX "Property_isPublished_status_sortOrder_idx" ON "Property"("isPublished", "status", "sortOrder");

-- CreateIndex
CREATE INDEX "Property_dealType_objectType_city_district_idx" ON "Property"("dealType", "objectType", "city", "district");

-- CreateIndex
CREATE INDEX "PropertyImage_propertyId_sortOrder_idx" ON "PropertyImage"("propertyId", "sortOrder");

-- CreateIndex
CREATE INDEX "Review_isPublished_date_idx" ON "Review"("isPublished", "date");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");
