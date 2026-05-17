import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/login-form";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-graphite px-4 py-10">
      <div className="w-full max-w-md border border-line bg-card p-7 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
        <p className="text-sm uppercase tracking-[0.24em] text-gold-light">
          Админ-панель
        </p>
        <h1 className="mt-4 serif-title text-4xl text-cream">
          Вход для администратора
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Управление объектами, отзывами, заявками и настройками сайта.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
