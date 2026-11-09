"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCta } from "@/components/layout/FloatingCta";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isShellFree =
    pathname?.startsWith("/admin") || pathname?.startsWith("/plataforma");

  if (isShellFree) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <FloatingCta />
    </>
  );
}
