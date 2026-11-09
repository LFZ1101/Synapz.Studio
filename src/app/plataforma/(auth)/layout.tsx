import { requireGuest } from "@/lib/plataforma/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireGuest();
  return children;
}
