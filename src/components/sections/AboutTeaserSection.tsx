import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { SITE } from "@/content/site";
import { differentials } from "@/content/studio";

export function AboutTeaserSection() {
  return (
    <Section tone="light" id="sobre">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              light
              eyebrow="Sobre"
              title="Entre uma ideia e um resultado existe uma conexão bem construída."
              description={
                <>
                  A SYNAPZ STUDIO é um estúdio digital que reúne estratégia,
                  criatividade, marketing e tecnologia. Criamos marcas,
                  conteúdos, campanhas, sites e sistemas a partir de uma visão
                  integrada — cada entrega como parte de uma experiência maior.
                </>
              }
            />
            <div className="mt-8">
              <Button href="/studio" variant="primary">
                Conhecer o Studio
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] bg-synapz-black relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_70%_40%,rgba(183,255,0,0.25),transparent_55%)]" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-synapz-neural">
                <p className="eyebrow text-synapz-impulse mb-3">Institucional</p>
                <p className="font-display text-2xl leading-snug">
                  {SITE.concept}
                </p>
                <p className="mt-4 text-sm text-synapz-signal">
                  Espaço reservado para fotografia ou vídeo institucional em
                  preto e branco com intervenção gráfica verde.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function DifferentialsSection() {
  return (
    <Section tone="graphite">
      <Container>
        <SectionHeading
          eyebrow="Diferenças"
          title="O que muda quando tudo se conecta."
        />
        <ul className="mt-14 divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
          {differentials.map((item, index) => (
            <li
              key={item.title}
              className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline"
            >
              <span className="eyebrow text-synapz-impulse md:col-span-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl md:text-2xl md:col-span-4">
                {item.title}
              </h3>
              <p className="text-synapz-signal md:col-span-6 leading-relaxed">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function ResultsSection() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Resultados"
          title="O resultado aparece quando tudo se conecta."
          description="Esta seção está preparada para depoimentos reais, métricas com contexto e estudos de caso publicados. Enquanto isso, preferimos apresentar processo e entregas — sem inventar provas sociais."
        />
        <div className="mt-10 border border-dashed border-synapz-neural/20 p-8 text-synapz-signal">
          <p>
            Quando houver autorização de clientes, publicaremos aqui: depoimento,
            cargo, empresa, projeto relacionado, métrica, período e fonte.
          </p>
        </div>
      </Container>
    </Section>
  );
}
