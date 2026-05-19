"use client";

type UploadResponse = {
  url?: string;
  error?: string;
};

export function uploadFileWithProgress(
  file: File,
  endpoint: string,
  onProgress: (progress: number) => void,
) {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const body = new FormData();
    body.append("file", file);

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) {
        return;
      }

      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    });

    xhr.addEventListener("load", () => {
      let payload: UploadResponse = {};

      try {
        payload = JSON.parse(xhr.responseText) as UploadResponse;
      } catch {
        payload = {};
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload.url) {
        resolve(payload.url);
        return;
      }

      reject(new Error(payload.error ?? "Ошибка загрузки"));
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Сбой сети при загрузке"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Загрузка отменена"));
    });

    xhr.open("POST", endpoint);
    xhr.send(body);
  });
}
