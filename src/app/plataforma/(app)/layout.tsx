import { PlatformShell } from "@/components/plataforma/PlatformShell";
import { requireUser } from "@/lib/plataforma/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return <PlatformShell user={user}>{children}</PlatformShell>;
}
