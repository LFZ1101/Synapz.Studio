import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { CTA, SITE } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Contato — Conversar com a SYNAPZ STUDIO",
  description:
    "Fale com a SYNAPZ sobre marca, conteúdo, campanhas, sites e sistemas. Envie o formulário e continue a conversa no WhatsApp.",
  path: "/contato",
});

export default function ContatoPage() {
  const wa = whatsappUrl(
    SITE.contact.whatsapp || "5543999541462",
    "Olá SYNAPZ, gostaria de conversar sobre um projeto.",
  );

  return (
    <main id="conteudo-principal">
      <JsonLd
        data={[
          webPageSchema({
            title: "Contato — SYNAPZ STUDIO",
            description: metadata.description as string,
            path: "/contato",
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Contato", path: "/contato" },
          ]),
        ]}
      />

      <Section className="relative overflow-hidden pt-28 md:pt-32">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_15%_10%,rgba(183,255,0,0.08),transparent_70%)]"
          aria-hidden
        />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              <Eyebrow accent>Contato</Eyebrow>
              <h1 className="font-display text-4xl sm:text-5xl text-balance">
                Conte o que precisa. Seguimos juntos no WhatsApp.
              </h1>
              <p className="text-synapz-signal leading-relaxed text-lg text-pretty">
                Preencha o formulário com o essencial do projeto. Ao enviar, você
                é direcionado ao WhatsApp da SYNAPZ com a mensagem já montada.
              </p>

              <ul className="space-y-4 text-sm text-synapz-signal border border-synapz-neural/10 p-5 bg-synapz-black/40">
                <li>
                  <p className="eyebrow text-synapz-impulse mb-1">WhatsApp</p>
                  <p className="text-synapz-neural text-base">
                    {SITE.contact.whatsappDisplay || "+55 43 99954-1462"}
                  </p>
                </li>
                {SITE.contact.email ? (
                  <li>
                    <p className="eyebrow text-synapz-impulse mb-1">E-mail</p>
                    <a
                      className="text-synapz-neural underline underline-offset-4"
                      href={`mailto:${SITE.contact.email}`}
                    >
                      {SITE.contact.email}
                    </a>
                  </li>
                ) : null}
                <li>
                  <p className="eyebrow text-synapz-impulse mb-1">Atendimento</p>
                  <p>{SITE.contact.areaServed}</p>
                </li>
              </ul>

              {wa ? (
                <Button
                  href={wa}
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CTA.whatsapp.label}
                </Button>
              ) : null}
            </div>

            <div className="lg:col-span-7">
              <div className="surface-panel p-6 md:p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
