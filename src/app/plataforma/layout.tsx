import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Plataforma | SYNAPZ STUDIO",
    template: "%s | SYNAPZ Plataforma",
  },
  robots: { index: false, follow: false },
};

export default function PlataformaRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
