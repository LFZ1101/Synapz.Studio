import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Termos de Uso — SYNAPZ STUDIO",
  description:
    "Condições de uso do site institucional da SYNAPZ STUDIO.",
  path: "/termos",
});

export default function TermsPage() {
  return (
    <main id="conteudo-principal">
      <Section className="pt-28 md:pt-32">
        <Container className="max-w-3xl">
          <Eyebrow accent className="mb-4">
            Legal
          </Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl">Termos de Uso</h1>
          <p className="mt-6 text-synapz-signal">
            Última atualização: 22 de setembro de 2026.
          </p>

          <div className="mt-12 space-y-8 text-synapz-signal leading-relaxed">
            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                1. Objeto
              </h2>
              <p>
                Este site apresenta a {SITE.name}, seus serviços e conteúdos
                institucionais. O uso implica concordância com estes termos.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                2. Conteúdo
              </h2>
              <p>
                Textos, identidade visual, marcas e materiais exibidos são de
                titularidade da SYNAPZ ou de parceiros autorizados. É vedada a
                reprodução sem autorização, exceto citações curtas com crédito.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                3. Contato comercial
              </h2>
              <p>
                Envios pelo formulário ou canais oficiais constituem solicitação
                de contato. Propostas, prazos e investimentos só têm validade
                após confirmação escrita pela SYNAPZ.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                4. Limitação
              </h2>
              <p>
                Empenhamos-nos em manter o site disponível e preciso, sem
                garantir ausência total de interrupções ou erros técnicos.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                5. Foro
              </h2>
              <p>
                Questões decorrentes destes termos serão interpretadas conforme a
                legislação brasileira.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
