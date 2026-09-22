import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidade — SYNAPZ STUDIO",
  description:
    "Como a SYNAPZ STUDIO trata dados pessoais coletados pelo site institucional e formulário de contato.",
  path: "/politica-de-privacidade",
});

export default function PrivacyPage() {
  return (
    <main id="conteudo-principal">
      <Section className="pt-28 md:pt-32">
        <Container className="max-w-3xl prose-invert">
          <Eyebrow accent className="mb-4">
            Legal
          </Eyebrow>
          <h1 className="font-display text-4xl md:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-6 text-synapz-signal">
            Última atualização: 22 de setembro de 2026. Este documento descreve
            como a {SITE.name} trata dados pessoais no contexto deste site
            institucional.
          </p>

          <div className="mt-12 space-y-8 text-synapz-signal leading-relaxed">
            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                1. Controlador
              </h2>
              <p>
                Os dados eventualmente enviados por meio do formulário de contato
                são tratados pela {SITE.name}, estúdio digital com atuação em{" "}
                {SITE.contact.areaServed}.
                {SITE.contact.email
                  ? ` Contato: ${SITE.contact.email}.`
                  : " O e-mail oficial será publicado quando disponível."}
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                2. Dados coletados
              </h2>
              <p>Podemos receber, quando você envia o formulário:</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>nome e empresa;</li>
                <li>e-mail e WhatsApp;</li>
                <li>tipo de projeto, objetivo, faixa de investimento e prazo;</li>
                <li>mensagem e consentimento informado.</li>
              </ul>
              <p className="mt-3">
                Ferramentas de analytics só serão ativadas com base legal adequada
                e, quando necessário, consentimento.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                3. Finalidade
              </h2>
              <p>
                Os dados são usados exclusivamente para retorno comercial sobre o
                projeto solicitado, esclarecimentos e organização do atendimento.
                Não vendemos listas de contatos.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                4. Base legal
              </h2>
              <p>
                Tratamos dados com base no consentimento (quando marcado no
                formulário) e/ou no legítimo interesse para atendimento de
                solicitações espontâneas, nos termos da LGPD.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                5. Compartilhamento
              </h2>
              <p>
                Dados podem ser processados por provedores de e-mail, hospedagem
                ou formulário estritamente necessários à operação. Não há
                compartilhamento comercial com terceiros.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                6. Direitos do titular
              </h2>
              <p>
                Você pode solicitar acesso, correção, eliminação, portabilidade ou
                revogação de consentimento pelos canais de contato publicados
                neste site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                7. Retenção
              </h2>
              <p>
                Mantemos os dados pelo tempo necessário ao atendimento e a
                obrigações legais. Após esse período, eliminamos ou anonimizamos
                as informações.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-synapz-neural mb-3">
                8. Alterações
              </h2>
              <p>
                Esta política pode ser atualizada. A data no topo da página
                indica a versão vigente.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
