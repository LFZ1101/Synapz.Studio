import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Inicie um Projeto com a SYNAPZ STUDIO",
  description:
    "Converse com a SYNAPZ sobre estratégia, marketing, design, sites, campanhas e sistemas personalizados.",
  path: "/contato",
});

export default function ContatoPage() {
  const wa = whatsappUrl(
    SITE.contact.whatsapp,
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
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              <Eyebrow accent>Contato</Eyebrow>
              <h1 className="font-display text-4xl sm:text-5xl text-balance">
                Vamos ativar a próxima conexão?
              </h1>
              <p className="text-synapz-signal leading-relaxed text-lg">
                Conte um pouco sobre sua empresa, seu momento e o que precisa
                ser colocado em movimento.
              </p>
              <ul className="space-y-3 text-sm text-synapz-signal">
                {SITE.contact.email ? (
                  <li>
                    E-mail:{" "}
                    <a
                      className="text-synapz-neural underline underline-offset-4"
                      href={`mailto:${SITE.contact.email}`}
                    >
                      {SITE.contact.email}
                    </a>
                  </li>
                ) : null}
                {wa ? (
                  <li>
                    WhatsApp:{" "}
                    <a
                      className="text-synapz-neural underline underline-offset-4"
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Conversar agora
                    </a>
                  </li>
                ) : (
                  <li>
                    Canais diretos (e-mail e WhatsApp) podem ser configurados via
                    variáveis de ambiente antes da publicação.
                  </li>
                )}
                <li>Atendimento: {SITE.contact.areaServed}</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
