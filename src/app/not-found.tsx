import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { SymbolMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main
      id="conteudo-principal"
      className="min-h-[80svh] flex items-center pt-24"
    >
      <Container className="py-20">
        <p className="eyebrow text-synapz-impulse mb-4">Erro 404</p>
        <div className="flex items-start gap-6">
          <SymbolMark size={56} className="hidden sm:block mt-2" />
          <div className="space-y-6 max-w-xl">
            <h1 className="font-display text-4xl md:text-5xl">
              Essa conexão não existe.
            </h1>
            <p className="text-synapz-signal leading-relaxed">
              A página solicitada não foi encontrada. Ela pode ter sido movida
              ou o endereço pode estar incorreto.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/" variant="impulse">
                Voltar ao início
              </Button>
              <Button href="/contato" variant="secondary">
                Falar com a SYNAPZ
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
