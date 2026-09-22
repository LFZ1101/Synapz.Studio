import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { absoluteUrl } from "@/lib/utils";

const defaultOgImage = "/og/share.jpg";

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image = defaultOgImage,
  noIndex = false,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: SITE.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const homeMetadata = buildMetadata({
  title: "SYNAPZ STUDIO — Estratégia, Marketing, Design e Tecnologia",
  description:
    "A SYNAPZ STUDIO conecta estratégia, criatividade, marketing, design e tecnologia para criar marcas, campanhas, sites e sistemas que movimentam negócios.",
  path: "/",
});
