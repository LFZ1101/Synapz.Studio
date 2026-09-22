import { Container, Section, SectionHeading } from "@/components/ui/Layout";

function ImpulseWord({ children }: { children: string }) {
  return <span className="text-synapz-impulse">{children}</span>;
}

export function ManifestoSection() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Manifesto"
          title={
            <>
              Elementos isolados não constroem uma presença relevante.
            </>
          }
        />
        <div className="mt-10 max-w-3xl space-y-6 text-lg md:text-xl leading-relaxed text-synapz-signal">
          <p>
            Uma marca precisa de <ImpulseWord>estratégia</ImpulseWord> para
            encontrar direção, <ImpulseWord>criatividade</ImpulseWord> para ser
            percebida e <ImpulseWord>tecnologia</ImpulseWord> para transformar
            atenção em experiência.
          </p>
          <p>
            A SYNAPZ conecta essas competências para construir marcas mais
            claras, presentes e preparadas para avançar.
          </p>
          <p>
            Não criamos apenas páginas, publicações ou campanhas. Criamos{" "}
            <ImpulseWord>conexões</ImpulseWord> entre o que uma empresa é, o que
            ela comunica e o que as pessoas experimentam.
          </p>
        </div>
      </Container>
    </Section>
  );
}
