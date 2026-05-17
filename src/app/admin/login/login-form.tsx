"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockKeyhole } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Неверный логин или пароль");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="space-y-2 text-sm text-muted">
        <span>Email</span>
        <input name="email" type="email" required className="h-12 px-4" />
      </label>
      <label className="space-y-2 text-sm text-muted">
        <span>Пароль</span>
        <input name="password" type="password" required className="h-12 px-4" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 bg-gold px-6 py-4 font-semibold text-graphite-deep hover:bg-gold-light disabled:cursor-wait disabled:opacity-70"
      >
        <LockKeyhole size={18} />
        {pending ? "Вход..." : "Войти"}
      </button>
      {error ? (
        <p className="border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}
    </form>
  );
}
