import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { savePropertyImage } from "@/lib/upload-media";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Файл не выбран" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Нужен файл изображения" }, { status: 400 });
  }

  try {
    const url = await savePropertyImage(file);
    return Response.json({ url });
  } catch (error) {
    console.error("upload image", error);
    return Response.json(
      { error: "Не удалось сохранить фото на сервере" },
      { status: 500 },
    );
  }
}
