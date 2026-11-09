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
    "Conte o contexto do seu próximo projeto. A SYNAPZ prepara a mensagem para você revisar e enviar no WhatsApp.",
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

      <Section className="pt-28 md:pt-32">
        <Container>
          <div className="mx-auto max-w-2xl space-y-5 lg:mx-0 lg:max-w-none">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
              <div className="lg:col-span-5 space-y-5">
                <Eyebrow accent>Contato</Eyebrow>
                <h1 className="font-display text-4xl sm:text-5xl text-balance">
                  Vamos entender o seu próximo projeto.
                </h1>
                <p className="text-synapz-signal leading-relaxed text-base md:text-lg text-pretty">
                  A mensagem será preparada para revisão no WhatsApp. Você ainda
                  poderá conferir o texto e enviar quando estiver pronto — nada é
                  enviado automaticamente.
                </p>

                <div className="hidden lg:block space-y-4 pt-4">
                  <ContactChannels wa={wa} />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="border border-synapz-neural/10 bg-synapz-graphite/40 p-5 sm:p-6 md:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>

            <div className="lg:hidden space-y-4 pt-2">
              <ContactChannels wa={wa} />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function ContactChannels({ wa }: { wa: string }) {
  return (
    <>
      <ul className="space-y-4 text-sm text-synapz-signal border border-synapz-neural/10 p-5">
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
          className="min-h-11"
          target="_blank"
          rel="noopener noreferrer"
        >
          {CTA.whatsapp.label}
        </Button>
      ) : null}
    </>
  );
}
