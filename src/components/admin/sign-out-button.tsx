"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="inline-flex items-center gap-2 border border-line px-4 py-2 text-sm text-muted hover:border-gold hover:text-gold-light"
    >
      <LogOut size={16} />
      Выйти
    </button>
  );
}
