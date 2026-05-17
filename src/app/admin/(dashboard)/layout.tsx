import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-graphite text-cream lg:grid lg:grid-cols-[260px_1fr]">
      <AdminNav />
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-line bg-graphite/80 px-5 py-4 lg:hidden">
          <span className="text-sm text-muted">Админ-панель</span>
          <SignOutButton />
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
