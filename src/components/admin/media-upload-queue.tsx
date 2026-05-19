"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Film, ImageIcon, Loader2, Trash2, XCircle } from "lucide-react";
import { formatFileSize } from "@/lib/format-file-size";
import { uploadFileWithProgress } from "@/lib/upload-with-progress";

type MediaKind = "image" | "video";

type QueueItem = {
  id: string;
  file: File;
  kind: MediaKind;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  url?: string;
  error?: string;
  previewUrl?: string;
};

type MediaUploadQueueProps = {
  imageUrls: string[];
  videoUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
  onVideoUrlsChange: (urls: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function MediaUploadQueue({
  imageUrls,
  videoUrls,
  onImageUrlsChange,
  onVideoUrlsChange,
  onBusyChange,
}: MediaUploadQueueProps) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const processingRef = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const busyCount = useMemo(
    () =>
      items.filter(
        (item) => item.status === "queued" || item.status === "uploading",
      ).length,
    [items],
  );

  const overallProgress = useMemo(() => {
    if (!items.length) {
      return 0;
    }

    const sum = items.reduce((total, item) => {
      if (item.status === "done") {
        return total + 100;
      }

      if (item.status === "error") {
        return total;
      }

      return total + item.progress;
    }, 0);

    return Math.round(sum / items.length);
  }, [items]);

  useEffect(() => {
    onBusyChange?.(busyCount > 0);
  }, [busyCount, onBusyChange]);

  const syncUrls = useCallback(
    (nextItems: QueueItem[]) => {
      onImageUrlsChange(
        nextItems
          .filter((item) => item.kind === "image" && item.status === "done" && item.url)
          .map((item) => item.url as string),
      );
      onVideoUrlsChange(
        nextItems
          .filter((item) => item.kind === "video" && item.status === "done" && item.url)
          .map((item) => item.url as string),
      );
    },
    [onImageUrlsChange, onVideoUrlsChange],
  );

  const processQueue = useCallback(async () => {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    try {
      while (true) {
        const current = itemsRef.current;
        const next = current.find((item) => item.status === "queued");

        if (!next) {
          break;
        }

        const endpoint =
          next.kind === "image"
            ? "/api/admin/upload/image"
            : "/api/admin/upload/video";

        setItems((prev) =>
          prev.map((item) =>
            item.id === next.id
              ? { ...item, status: "uploading", progress: 0, error: undefined }
              : item,
          ),
        );

        try {
          const url = await uploadFileWithProgress(next.file, endpoint, (progress) => {
            setItems((prev) =>
              prev.map((item) =>
                item.id === next.id ? { ...item, progress } : item,
              ),
            );
          });

          setItems((prev) => {
            const updated = prev.map((item) =>
              item.id === next.id
                ? { ...item, status: "done" as const, progress: 100, url }
                : item,
            );
            syncUrls(updated);
            return updated;
          });
        } catch (error) {
          setItems((prev) =>
            prev.map((item) =>
              item.id === next.id
                ? {
                    ...item,
                    status: "error",
                    progress: 0,
                    error:
                      error instanceof Error
                        ? error.message
                        : "Не удалось загрузить",
                  }
                : item,
            ),
          );
        }
      }
    } finally {
      processingRef.current = false;

      if (itemsRef.current.some((item) => item.status === "queued")) {
        void processQueue();
      }
    }
  }, [syncUrls]);

  function enqueueFiles(files: FileList | File[], kind: MediaKind) {
    const additions: QueueItem[] = Array.from(files).map((file) => ({
      id: createId(),
      file,
      kind,
      progress: 0,
      status: "queued" as const,
      previewUrl:
        kind === "image" ? URL.createObjectURL(file) : undefined,
    }));

    setItems((prev) => [...prev, ...additions]);
    queueMicrotask(() => {
      void processQueue();
    });
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);

      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }

      const updated = prev.filter((item) => item.id !== id);
      syncUrls(updated);
      return updated;
    });
  }

  function retryItem(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "queued", progress: 0, error: undefined }
          : item,
      ),
    );
    queueMicrotask(() => {
      void processQueue();
    });
  }

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 border border-line bg-graphite-deep/40 px-4 py-3 text-base font-medium text-cream hover:border-gold">
          <ImageIcon size={20} className="text-gold" />
          Добавить фото
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files?.length) {
                enqueueFiles(event.target.files, "image");
              }
              event.target.value = "";
            }}
          />
        </label>

        <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 border border-line bg-graphite-deep/40 px-4 py-3 text-base font-medium text-cream hover:border-gold">
          <Film size={20} className="text-gold" />
          Добавить видео
          <input
            type="file"
            accept="video/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files?.length) {
                enqueueFiles(event.target.files, "video");
              }
              event.target.value = "";
            }}
          />
        </label>
      </div>

      <p className="text-sm leading-6 text-muted">
        Файлы любого размера загружаются по одному. Можно добавлять несколько
        подряд — внизу появится список с прогрессом.
      </p>

      {items.length ? (
        <div className="space-y-3 border border-line bg-card/60 p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm text-muted">
              <span>
                {busyCount > 0
                  ? `Загружается: ${busyCount}`
                  : "Загрузка завершена"}
              </span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-graphite-deep">
              <div
                className="h-full bg-gold transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <ul className="max-h-72 space-y-2 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-3 border border-line bg-graphite-deep/35 p-3"
              >
                <div className="relative size-16 shrink-0 overflow-hidden bg-graphite-deep">
                  {item.kind === "image" && item.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        item.status === "done" && item.url
                          ? item.url
                          : item.previewUrl
                      }
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-gold">
                      <Film size={22} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-cream">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatFileSize(item.file.size)}
                        {item.kind === "video" ? " · видео" : " · фото"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {item.status === "done" ? (
                        <CheckCircle2 size={18} className="text-gold-light" />
                      ) : item.status === "error" ? (
                        <XCircle size={18} className="text-gold-light" />
                      ) : item.status === "uploading" ? (
                        <Loader2
                          size={18}
                          className="animate-spin text-gold-light"
                        />
                      ) : null}

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="grid size-9 place-items-center text-muted hover:text-gold-light"
                        aria-label="Удалить из списка"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {item.status === "uploading" || item.status === "queued" ? (
                    <div className="h-1.5 overflow-hidden rounded-full bg-graphite-deep">
                      <div
                        className={`h-full transition-all duration-300 ${
                          item.status === "queued" ? "bg-line" : "bg-gold"
                        }`}
                        style={{
                          width: `${item.status === "queued" ? 8 : item.progress}%`,
                        }}
                      />
                    </div>
                  ) : null}

                  {item.status === "error" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs text-gold-light">{item.error}</p>
                      <button
                        type="button"
                        onClick={() => retryItem(item.id)}
                        className="text-xs font-medium text-cream underline hover:text-gold-light"
                      >
                        Повторить
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <textarea
        name="imageUrls"
        readOnly
        value={imageUrls.join("\n")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
      <textarea
        name="videoUrls"
        readOnly
        value={videoUrls.join("\n")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}
