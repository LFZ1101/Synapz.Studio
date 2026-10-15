import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { homeMetadata } from "@/lib/seo";
import { SITE } from "@/content/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  ...homeMetadata,
  applicationName: SITE.name,
  authors: [{ name: SITE.founder.name }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "estúdio digital",
    "agência digital",
    "marketing digital",
    "design",
    "criação de sites",
    "landing pages",
    "social media",
    "campanhas digitais",
    "sistemas personalizados",
    "SYNAPZ STUDIO",
  ],
  icons: {
    icon: [
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-180.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-synapz-black text-synapz-neural font-sans">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
