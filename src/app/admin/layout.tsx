import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ADMIN_COOKIE,
  isAdminConfigured,
  verifyAdminToken,
} from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin — SYNAPZ STUDIO",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminConfigured()) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-synapz-black px-6">
        <div className="max-w-md space-y-4 border border-synapz-neural/15 p-8">
          <p className="eyebrow text-synapz-impulse">Admin</p>
          <h1 className="font-display text-2xl text-synapz-neural">
            Configure a senha do painel
          </h1>
          <p className="text-sm text-synapz-signal leading-relaxed">
            Defina <code className="text-synapz-impulse">ADMIN_SECRET</code> (mín.
            8 caracteres) no arquivo <code>.env.local</code> ou no ambiente do
            servidor e reinicie. O site público continua sem login.
          </p>
        </div>
      </div>
    );
  }

  const jar = await cookies();
  const authed = verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
  if (!authed) {
    return <AdminLogin />;
  }

  return <AdminShell>{children}</AdminShell>;
}
