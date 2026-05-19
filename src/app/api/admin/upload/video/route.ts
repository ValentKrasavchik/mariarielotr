import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { savePropertyVideo } from "@/lib/upload-media";

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

  if (!file.type.startsWith("video/")) {
    return Response.json({ error: "Нужен видеофайл" }, { status: 400 });
  }

  try {
    const url = await savePropertyVideo(file);
    return Response.json({ url });
  } catch (error) {
    console.error("upload video", error);
    return Response.json(
      { error: "Не удалось сохранить видео на сервере" },
      { status: 500 },
    );
  }
}
