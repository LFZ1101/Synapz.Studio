import { Container, Section } from "@/components/ui/Layout";

function ImpulseWord({ children }: { children: string }) {
  return <span className="text-synapz-impulse">{children}</span>;
}

export function ManifestoSection() {
  return (
    <Section>
      <Container>
        <p className="eyebrow text-synapz-impulse mb-6">Manifesto</p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.1] text-balance max-w-3xl">
          Elementos isolados não constroem uma presença relevante.
        </h2>
        <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-synapz-signal">
          Uma marca precisa de <ImpulseWord>estratégia</ImpulseWord>,{" "}
          <ImpulseWord>criatividade</ImpulseWord> e{" "}
          <ImpulseWord>tecnologia</ImpulseWord> trabalhando juntas. A SYNAPZ
          cria essas <ImpulseWord>conexões</ImpulseWord> — do que a empresa é ao
          que as pessoas experimentam.
        </p>
      </Container>
    </Section>
  );
}
