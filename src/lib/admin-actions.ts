"use server";

import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/admin/login");
  }
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function optionalNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

const translit: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((char) => translit[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function propertyData(formData: FormData) {
  const title = text(formData, "title");
  const slug = text(formData, "slug") || slugify(title);

  return {
    title,
    slug,
    dealType: text(formData, "dealType"),
    objectType: text(formData, "objectType"),
    status: text(formData, "status"),
    price: numberValue(formData, "price"),
    currency: text(formData, "currency") || "RUB",
    city: text(formData, "city"),
    district: text(formData, "district"),
    address: optionalText(formData, "address"),
    area: numberValue(formData, "area"),
    rooms: optionalNumber(formData, "rooms"),
    floor: optionalNumber(formData, "floor"),
    floors: optionalNumber(formData, "floors"),
    bathroom: optionalText(formData, "bathroom"),
    renovation: optionalText(formData, "renovation"),
    builtYear: optionalNumber(formData, "builtYear"),
    description: text(formData, "description"),
    benefits: optionalText(formData, "benefits"),
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    isPublished: checked(formData, "isPublished"),
    showInHero: checked(formData, "showInHero"),
    heroOrder: numberValue(formData, "heroOrder"),
    sortOrder: numberValue(formData, "sortOrder"),
  };
}

async function saveUploadedImages(formData: FormData) {
  const files = formData.getAll("photos");
  const uploadDir = path.join(process.cwd(), "public", "uploads", "properties");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) {
      continue;
    }

    const extension = path.extname(entry.name) || ".jpg";
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const buffer = Buffer.from(await entry.arrayBuffer());

    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/properties/${filename}`);
  }

  return urls;
}

async function saveUploadedVideos(formData: FormData) {
  const files = formData.getAll("videos");
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "properties",
    "videos",
  );
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) {
      continue;
    }

    const extension = path.extname(entry.name) || ".mp4";
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const buffer = Buffer.from(await entry.arrayBuffer());

    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/properties/videos/${filename}`);
  }

  return urls;
}

function imageUrlsFromTextarea(formData: FormData) {
  return text(formData, "imageUrls")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

function videoUrlsFromTextarea(formData: FormData) {
  return text(formData, "videoUrls")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

export async function createProperty(formData: FormData) {
  await ensureAdmin();

  const data = propertyData(formData);
  const images = [
    ...imageUrlsFromTextarea(formData),
    ...(await saveUploadedImages(formData)),
  ];
  const videos = [
    ...videoUrlsFromTextarea(formData),
    ...(await saveUploadedVideos(formData)),
  ];

  const property = await prisma.property.create({
    data: {
      ...data,
      images: {
        create: images.map((url, index) => ({
          url,
          alt: data.title,
          sortOrder: index,
        })),
      },
      videos: {
        create: videos.map((url, index) => ({
          url,
          title: data.title,
          sortOrder: index,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/objects");
  redirect(`/admin/objects/${property.id}`);
}

export async function updateProperty(id: string, formData: FormData) {
  await ensureAdmin();

  const data = propertyData(formData);
  const currentImageCount = await prisma.propertyImage.count({
    where: { propertyId: id },
  });
  const currentVideoCount = await prisma.propertyVideo.count({
    where: { propertyId: id },
  });
  const newImages = [
    ...imageUrlsFromTextarea(formData),
    ...(await saveUploadedImages(formData)),
  ];
  const newVideos = [
    ...videoUrlsFromTextarea(formData),
    ...(await saveUploadedVideos(formData)),
  ];

  await prisma.property.update({
    where: { id },
    data: {
      ...data,
      images: {
        create: newImages.map((url, index) => ({
          url,
          alt: data.title,
          sortOrder: currentImageCount + index,
        })),
      },
      videos: {
        create: newVideos.map((url, index) => ({
          url,
          title: data.title,
          sortOrder: currentVideoCount + index,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/objects");
  revalidatePath(`/objects/${data.slug}`);
  revalidatePath("/admin/objects");
  redirect(`/admin/objects/${id}?saved=1`);
}

export async function deleteProperty(formData: FormData) {
  await ensureAdmin();

  const id = text(formData, "id");
  await prisma.property.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/objects");
  redirect("/admin/objects");
}

export async function togglePropertyPublish(id: string, isPublished: boolean) {
  await ensureAdmin();

  await prisma.property.update({
    where: { id },
    data: { isPublished: !isPublished },
  });

  revalidatePath("/");
  revalidatePath("/objects");
  revalidatePath("/admin/objects");
}

export async function deletePropertyImage(formData: FormData) {
  await ensureAdmin();

  const id = text(formData, "id");
  const image = await prisma.propertyImage.findUnique({ where: { id } });

  if (image) {
    await prisma.propertyImage.delete({ where: { id } });

    if (image.url.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", image.url.replace(/^\//, ""))).catch(
        () => undefined,
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/objects");
  revalidatePath("/admin/objects");
}

export async function deletePropertyVideo(formData: FormData) {
  await ensureAdmin();

  const id = text(formData, "id");
  const video = await prisma.propertyVideo.findUnique({ where: { id } });

  if (video) {
    await prisma.propertyVideo.delete({ where: { id } });

    if (video.url.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", video.url.replace(/^\//, ""))).catch(
        () => undefined,
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/objects");
  revalidatePath("/admin/objects");
  if (video?.propertyId) {
    revalidatePath(`/admin/objects/${video.propertyId}`);
  }
}

export async function createReview(formData: FormData) {
  await ensureAdmin();

  await prisma.review.create({
    data: {
      clientName: text(formData, "clientName"),
      text: text(formData, "text"),
      rating: numberValue(formData, "rating", 5),
      photo: optionalText(formData, "photo"),
      date: new Date(text(formData, "date") || Date.now()),
      isPublished: checked(formData, "isPublished"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function updateReview(id: string, formData: FormData) {
  await ensureAdmin();

  await prisma.review.update({
    where: { id },
    data: {
      clientName: text(formData, "clientName"),
      text: text(formData, "text"),
      rating: numberValue(formData, "rating", 5),
      photo: optionalText(formData, "photo"),
      date: new Date(text(formData, "date") || Date.now()),
      isPublished: checked(formData, "isPublished"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  await ensureAdmin();

  await prisma.review.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function updateLeadStatus(id: string, formData: FormData) {
  await ensureAdmin();

  await prisma.lead.update({
    where: { id },
    data: { status: text(formData, "status") },
  });

  revalidatePath("/admin/leads");
}

export async function updateSettings(formData: FormData) {
  await ensureAdmin();

  const first = await prisma.siteSettings.findFirst();
  const data = {
    phone: text(formData, "phone"),
    whatsapp: text(formData, "whatsapp"),
    telegram: text(formData, "telegram"),
    email: text(formData, "email"),
    heroTitle: text(formData, "heroTitle"),
    heroSubtitle: text(formData, "heroSubtitle"),
    heroText: text(formData, "heroText"),
    aboutText: text(formData, "aboutText"),
    seoTitle: text(formData, "seoTitle"),
    seoDescription: text(formData, "seoDescription"),
    workTime: text(formData, "workTime"),
    region: text(formData, "region"),
  };

  if (first) {
    await prisma.siteSettings.update({ where: { id: first.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
