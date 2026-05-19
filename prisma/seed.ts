import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const imageSets = {
  central: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
  ],
  businessCenter: [
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85",
  ],
  suburbs: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=85",
  ],
  historic: [
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
  ],
  commercial: [
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85",
  ],
  family: [
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1600&q=85",
  ],
  regionHouse: [
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
  ],
  metro: [
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1600&q=85",
  ],
};

const properties = [
  {
    title: "Квартира с видом на парк в Центральном районе",
    slug: "kvartira-hamovniki-park",
    dealType: "sale",
    objectType: "apartment",
    status: "actual",
    price: 48500000,
    city: "Донецк",
    district: "Центральный",
    address: "Центральный район",
    area: 82.4,
    rooms: 3,
    floor: 9,
    floors: 14,
    bathroom: "2 санузла",
    renovation: "Современный ремонт",
    builtYear: 2018,
    description:
      "Светлая трехкомнатная квартира с продуманной планировкой, кухней-гостиной и мастер-спальней. Дом расположен в спокойной части района рядом с парком, школами и удобной инфраструктурой.",
    benefits:
      "Вид на зеленую зону\nПодземный паркинг\nЗакрытый двор\nДокументы готовы к сделке",
    showInHero: true,
    heroOrder: 1,
    sortOrder: 1,
    images: imageSets.central,
  },
  {
    title: "Апартаменты в деловом центре Донецка",
    slug: "apartamenty-moscow-city",
    dealType: "rent",
    objectType: "apartment",
    status: "actual",
    price: 220000,
    city: "Донецк",
    district: "Киевский",
    address: "проспект Мира",
    area: 58,
    rooms: 2,
    floor: 34,
    floors: 52,
    bathroom: "1 санузел",
    renovation: "Дизайнерский ремонт",
    builtYear: 2021,
    description:
      "Представительные апартаменты для аренды в деловом центре Донецка. Панорамные окна, полностью укомплектованная кухня и быстрый доступ к инфраструктуре центра города.",
    benefits:
      "Панорамный вид\nКонсьерж-сервис\nГотово к проживанию\nМетро в пешей доступности",
    showInHero: true,
    heroOrder: 2,
    sortOrder: 2,
    images: imageSets.businessCenter,
  },
  {
    title: "Загородный дом в Донецкой области",
    slug: "dom-rublevskoe-napravlenie",
    dealType: "sale",
    objectType: "house",
    status: "actual",
    price: 138000000,
    city: "Донецкая область",
    district: "пригород Донецка",
    address: "закрытый коттеджный поселок",
    area: 326,
    rooms: 6,
    floor: 2,
    floors: 2,
    bathroom: "4 санузла",
    renovation: "Премиальная отделка",
    builtYear: 2019,
    description:
      "Современный загородный дом с приватным участком, террасой и просторной гостиной. Формат для семьи, которой важны тишина, безопасность и быстрый выезд в Донецк.",
    benefits:
      "Участок 18 соток\nОхраняемый поселок\nГараж на 2 автомобиля\nЛандшафтный дизайн",
    showInHero: true,
    heroOrder: 3,
    sortOrder: 3,
    images: imageSets.suburbs,
  },
  {
    title: "Квартира в историческом доме",
    slug: "kvartira-zamoskvorechye",
    dealType: "sale",
    objectType: "apartment",
    status: "actual",
    price: 37200000,
    city: "Донецк",
    district: "Калининский",
    address: "тихий переулок в центре",
    area: 67.5,
    rooms: 2,
    floor: 4,
    floors: 6,
    bathroom: "1 санузел",
    renovation: "Классический ремонт",
    builtYear: 1912,
    description:
      "Квартира в доме с характером: высокие потолки, уютная гостиная и камерная атмосфера исторического центра. Подходит для жизни или инвестиционной сдачи.",
    benefits:
      "Высокие потолки\nИсторический фасад\nТихий центр\nОдин взрослый собственник",
    sortOrder: 4,
    images: imageSets.historic,
  },
  {
    title: "Коммерческое помещение на первой линии",
    slug: "kommercheskoe-pomeschenie-presnya",
    dealType: "sale",
    objectType: "commercial",
    status: "actual",
    price: 64500000,
    city: "Донецк",
    district: "Петровский",
    address: "первая линия оживленной улицы",
    area: 118,
    rooms: null,
    floor: 1,
    floors: 9,
    bathroom: "2 мокрые точки",
    renovation: "Под отделку",
    builtYear: 2006,
    description:
      "Помещение свободного назначения с отдельным входом, витринными окнами и стабильным пешеходным трафиком. Планировка подходит под салон, офис продаж или шоурум.",
    benefits:
      "Отдельный вход\nВитринные окна\nВысокий трафик\nЭлектрическая мощность 35 кВт",
    sortOrder: 5,
    images: imageSets.commercial,
  },
  {
    title: "Семейная квартира в Киевском районе",
    slug: "semeynaya-kvartira-kommunarka",
    dealType: "sale",
    objectType: "apartment",
    status: "actual",
    price: 18600000,
    city: "Донецк",
    district: "Киевский",
    address: "Киевский район",
    area: 73.2,
    rooms: 3,
    floor: 11,
    floors: 17,
    bathroom: "раздельный",
    renovation: "Евроремонт",
    builtYear: 2020,
    description:
      "Практичная квартира для семьи: три изолированные комнаты, две лоджии и много мест хранения. Рядом школы, детские сады и прогулочные зоны.",
    benefits:
      "Изолированные комнаты\nРазвитая инфраструктура\nЧистая история владения\nБыстрый выход на сделку",
    sortOrder: 6,
    images: imageSets.family,
  },
  {
    title: "Дом в Донецкой области для спокойной жизни",
    slug: "dom-odintsovo",
    dealType: "sale",
    objectType: "house",
    status: "sold",
    price: 58900000,
    city: "Донецкая область",
    district: "Макеевка",
    address: "Макеевский район",
    area: 210,
    rooms: 5,
    floor: 2,
    floors: 2,
    bathroom: "3 санузла",
    renovation: "Качественная отделка",
    builtYear: 2017,
    description:
      "Проданный объект из портфеля: дом с удобной планировкой, зоной барбекю и быстрым выездом в Донецк.",
    benefits: "Закрытая территория\nГотовность к проживанию\nТеплый гараж\nУхоженный участок",
    sortOrder: 7,
    images: imageSets.regionHouse,
  },
  {
    title: "Двухкомнатная квартира у остановки транспорта",
    slug: "kvartira-metro-sokol",
    dealType: "rent",
    objectType: "apartment",
    status: "rented",
    price: 118000,
    city: "Донецк",
    district: "Калининский",
    address: "проспект Ильича",
    area: 54,
    rooms: 2,
    floor: 7,
    floors: 12,
    bathroom: "1 санузел",
    renovation: "Свежий ремонт",
    builtYear: 1978,
    description:
      "Сданный объект из портфеля: аккуратная квартира рядом с остановкой транспорта, парком и всей ежедневной инфраструктурой.",
    benefits: "5 минут до остановки\nТихие окна\nПолная комплектация\nАдекватный собственник",
    sortOrder: 8,
    images: imageSets.metro,
  },
];

const reviews = [
  {
    clientName: "Анна К.",
    text: "Я вообще не представляла, как продавать квартиру. Казалось, что надо просто выставить объявление и ждать. Оказалось, нюансов куча. Маша помогла с ценой, документами, показами. Я в процессе дергалась, конечно, но сделку в итоге прошли нормально.",
    rating: 5,
    date: new Date("2026-02-12"),
  },
  {
    clientName: "Илья и Марина",
    text: "Мы с Мариной спорили почти по каждой квартире. Мне важна была дорога до работы, ей двор и школа. Мария нас немного приземляла и часто говорила, что этот вариант лучше не брать. В итоге нашли квартиру, где оба выдохнули.",
    rating: 5,
    date: new Date("2026-01-18"),
  },
  {
    clientName: "Сергей П.",
    text: "Без лишней болтовни. Посмотрели объект, проверили документы, обсудили риски. Мне такой формат подходит. Все понятно и по делу.",
    rating: 5,
    date: new Date("2025-12-03"),
  },
  {
    clientName: "Елена",
    text: "Сдавала квартиру после ремонта, и мне было жалко отдавать ее непонятно кому. Маша сама общалась с людьми, задавала вопросы, которые мне бы даже в голову не пришли. Пару кандидатов отсекла сразу. Сейчас понимаю, что правильно.",
    rating: 5,
    date: new Date("2025-11-21"),
  },
  {
    clientName: "Ольга Н.",
    text: "Мне понравилось, что Маша не начала с обещаний продать дорого за три дня. Сначала разобрали квартиру, цену, фотографии, что лучше убрать перед показами. Покупатель нашелся быстрее, чем я думала, но без ощущения, что меня куда-то торопили.",
    rating: 5,
    date: new Date("2026-05-04"),
  },
  {
    clientName: "Дмитрий",
    text: "Покупал первую квартиру. Я смотрел на ремонт, кухню и вид из окна. Мария смотрела на документы, дом, историю квартиры и какие-то вещи, про которые я вообще не думал. Хорошо, что обратился до покупки, а не после.",
    rating: 5,
    date: new Date("2026-04-22"),
  },
  {
    clientName: "Наталья и Андрей",
    text: "Искали квартиру для мамы. Нам нужен был не просто хороший ремонт, а чтобы ей было удобно жить: магазин рядом, остановка, не высокий этаж, нормальный подъезд. Мария быстро поняла, что нам нужно, и не таскала по лишним вариантам.",
    rating: 5,
    date: new Date("2026-04-09"),
  },
  {
    clientName: "Виктор С.",
    text: "По коммерческому помещению было много вопросов. Договор, назначение, коммуникации, торг. Мария спокойно все разобрала и несколько моментов у продавца уточнила отдельно. Сам бы я, скорее всего, часть пропустил.",
    rating: 5,
    date: new Date("2026-03-27"),
  },
  {
    clientName: "Марина",
    text: "Я честно думала, что сдать квартиру легко. Ну выставила, ответила, показала. На деле устала через несколько дней. Маша забрала это на себя, и сразу стало проще. Нормальные жильцы нашлись без этой бесконечной переписки.",
    rating: 5,
    date: new Date("2026-03-14"),
  },
  {
    clientName: "Алексей П.",
    text: "Продавали дом. Там была история не на пять минут: участок, старые документы, какие-то уточнения по границам. Мария заранее сказала, что надо подтянуть, чтобы потом не бегать перед сделкой. Это сильно помогло.",
    rating: 5,
    date: new Date("2026-02-28"),
  },
  {
    clientName: "Татьяна",
    text: "Мне важно было, чтобы со мной разговаривали нормально, а не продавливали решение. С Марией было спокойно. Она могла прямо сказать, что вариант слабый, но без давления и без драматизации.",
    rating: 5,
    date: new Date("2026-02-06"),
  },
  {
    clientName: "Руслан и Екатерина",
    text: "Когда смотришь квартиру с ребенком, начинаешь замечать совсем другие вещи. Вернее, мы как раз не замечали, а Мария замечала 😄 Двор, шум, подъезд, дорога до школы, лифт. В итоге выбрали не самую эффектную квартиру на фото, но самую удобную для жизни.",
    rating: 5,
    date: new Date("2026-01-30"),
  },
  {
    clientName: "Ирина М.",
    text: "Я сначала хотела просто понять цену своей квартиры. Продавать не планировала прямо сейчас. Мария посмотрела аналоги, объяснила, что влияет на стоимость и где я завышаю ожидания. После этого уже решила выставляться.",
    rating: 5,
    date: new Date("2026-01-07"),
  },
  {
    clientName: "Павел",
    text: "Нормальная связь. Для меня это было главное. Написал - получил ответ. Без пропаданий, без воды, без красивых речей. В сделке и так хватает нервов.",
    rating: 5,
    date: new Date("2025-12-18"),
  },
  {
    clientName: "Светлана А.",
    text: "Я уже переехала и не могла ездить на показы. Маша отправляла мне обратную связь после каждого просмотра: кто приходил, что спрашивали, какая реакция. Было ощущение, что процесс идет, а не просто объявление висит где-то в интернете.",
    rating: 5,
    date: new Date("2025-12-10"),
  },
  {
    clientName: "Константин",
    text: "Брал консультацию перед покупкой. Час разговора, а пользы больше, чем от недели чтения форумов. Стало понятно, какие документы просить и какие вопросы задавать продавцу.",
    rating: 5,
    date: new Date("2025-11-30"),
  },
  {
    clientName: "Юлия",
    text: "С арендой мне было важно не заселить кого попало. Мария не спешила, хотя желающие были. Кому-то отказали, кто-то сам отпал после вопросов. В итоге нашли людей, с которыми мне спокойно.",
    rating: 5,
    date: new Date("2025-11-12"),
  },
  {
    clientName: "Артем",
    text: "Я смотрел объект под вложение и уже почти загорелся одним вариантом. На фото все красиво. Маша посчитала аренду, ремонт, район, спрос и сказала, что цифры не сходятся. Обидно было, но сейчас понимаю, что она была права.",
    rating: 4,
    date: new Date("2025-10-28"),
  },
  {
    clientName: "Лариса П.",
    text: "Я нервный человек, особенно когда речь про документы и деньги. Мария мне все объясняла простыми словами: что уже проверили, что еще осталось, где нет повода переживать. Для меня это было очень важно.",
    rating: 5,
    date: new Date("2025-10-15"),
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@mariarieltor.ru";
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";

  await prisma.admin.upsert({
    where: { email },
    update: {
      name: "Мария",
      passwordHash: await bcrypt.hash(password, 10),
    },
    create: {
      email,
      name: "Мария",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  const maxMessenger = "maria_rieltor";
  const regionDefaults = {
    heroSubtitle: "Я помогу спокойно решить вопрос с недвижимостью",
    heroText:
      "Лично помогаю купить, продать или подобрать недвижимость в Донецке и Донецкой области - от первой консультации до завершения сделки.",
    aboutText:
      "Я работаю как персональный риелтор: разбираю вашу ситуацию, объясняю риски простым языком и сопровождаю сделку лично. Для меня важны прозрачность, внимательность к деталям и спокойная коммуникация на каждом этапе.",
    seoTitle: "Мария Риелтор - недвижимость в Донецке и Донецкой области",
    seoDescription:
      "Личный сайт риелтора Марии: актуальные объекты, сопровождение покупки и продажи недвижимости, консультации по рынку.",
    region: "Донецк и Донецкая область",
  };

  const settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    const created = await prisma.siteSettings.create({ data: regionDefaults });
    await prisma.$executeRaw`
      UPDATE SiteSettings SET maxMessenger = ${maxMessenger} WHERE id = ${created.id}
    `;
  } else {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: regionDefaults,
    });
    await prisma.$executeRaw`
      UPDATE SiteSettings SET maxMessenger = ${maxMessenger} WHERE id = ${settings.id}
    `;
  }

  for (const item of properties) {
    await prisma.property.upsert({
      where: { slug: item.slug },
      update: {
        ...item,
        images: {
          deleteMany: {},
          create: item.images.map((url, index) => ({
            url,
            alt: item.title,
            sortOrder: index,
          })),
        },
      },
      create: {
        ...item,
        images: {
          create: item.images.map((url, index) => ({
            url,
            alt: item.title,
            sortOrder: index,
          })),
        },
      },
    });
  }

  for (const review of reviews) {
    const existing = await prisma.review.findFirst({
      where: { clientName: review.clientName },
    });

    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: review,
      });
    } else {
      await prisma.review.create({ data: review });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
