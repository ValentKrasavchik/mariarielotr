import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function savePropertyImage(file: File) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "properties");
  await mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/properties/${filename}`;
}

export async function savePropertyVideo(file: File) {
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "properties",
    "videos",
  );
  await mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.name) || ".mp4";
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/properties/videos/${filename}`;
}
