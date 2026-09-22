import { Logo } from "@/components/ui/Logo";
import { SITE, CTA } from "@/content/site";
import { nuclei } from "@/content/services";
import { formatYear } from "@/lib/utils";
import Link from "next/link";

export function Footer() {
  const year = formatYear();
  const hasWhatsapp = Boolean(SITE.contact.whatsapp);
  const hasInstagram = Boolean(SITE.social.instagram);
  const hasLinkedin = Boolean(SITE.social.linkedin);

  return (
    <footer className="border-t border-synapz-neural/10 bg-synapz-graphite">
      <div className="container-wide py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <Logo variant="principal" className="h-10 w-auto" />
            <p className="max-w-sm text-synapz-signal leading-relaxed">
              {SITE.tagline}
            </p>
            <p className="font-display text-xl text-synapz-neural">
              {SITE.concept}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow mb-4 text-synapz-impulse">Serviços</p>
            <ul className="space-y-3 text-sm text-synapz-signal">
              {nuclei.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    className="hover:text-synapz-neural transition-colors"
                  >
                    {n.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/servicos"
                  className="hover:text-synapz-neural transition-colors"
                >
                  Ver todos
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow mb-4 text-synapz-impulse">Studio</p>
            <ul className="space-y-3 text-sm text-synapz-signal">
              <li>
                <Link href="/studio" className="hover:text-synapz-neural">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/projetos" className="hover:text-synapz-neural">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="/#metodo" className="hover:text-synapz-neural">
                  Método
                </Link>
              </li>
              <li>
                <Link href={CTA.primary.href} className="hover:text-synapz-neural">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4 text-synapz-impulse">Contato</p>
            <ul className="space-y-3 text-sm text-synapz-signal">
              {SITE.contact.email ? (
                <li>
                  <a
                    href={`mailto:${SITE.contact.email}`}
                    className="hover:text-synapz-neural"
                  >
                    {SITE.contact.email}
                  </a>
                </li>
              ) : (
                <li>
                  <Link href="/contato" className="hover:text-synapz-neural">
                    Formulário de contato
                  </Link>
                </li>
              )}
              {hasWhatsapp ? (
                <li>
                  <a
                    href={`https://wa.me/${SITE.contact.whatsapp.replace(/\D/g, "")}`}
                    className="hover:text-synapz-neural"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {hasInstagram ? (
                <li>
                  <a
                    href={SITE.social.instagram}
                    className="hover:text-synapz-neural"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
              {hasLinkedin ? (
                <li>
                  <a
                    href={SITE.social.linkedin}
                    className="hover:text-synapz-neural"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              ) : null}
              {SITE.contact.city ? (
                <li>
                  {SITE.contact.city}
                  {SITE.contact.region ? `, ${SITE.contact.region}` : ""}
                </li>
              ) : (
                <li>Atendimento em todo o Brasil</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-synapz-neural/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-synapz-signal">
          <p>
            © {year} {SITE.name} — {SITE.concept}
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/politica-de-privacidade"
              className="hover:text-synapz-neural"
            >
              Política de privacidade
            </Link>
            <Link href="/termos" className="hover:text-synapz-neural">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
