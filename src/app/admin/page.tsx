import Link from "next/link";
import { readAllProjects } from "@/lib/projects-store";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  const projects = readAllProjects();
  const published = projects.filter((p) => p.published).length;
  const drafts = projects.length - published;
  const withVideo = projects.filter(
    (p) => p.video || p.gallery.some((g) => g.video || g.youtube),
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">Painel</h1>
        <p className="mt-2 max-w-2xl text-synapz-signal">
          Adicione, edite ou remova projetos e vídeos. O site público não pede
          login — só esta área usa a senha <code className="text-synapz-impulse">ADMIN_SECRET</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Projetos" value={String(projects.length)} />
        <Stat label="Publicados" value={String(published)} />
        <Stat label="Com vídeo" value={String(withVideo)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/projetos/novo"
          className="inline-flex h-12 items-center justify-center bg-synapz-impulse px-6 text-sm font-medium text-synapz-black"
        >
          Novo projeto
        </Link>
        <Link
          href="/admin/projetos"
          className="inline-flex h-12 items-center justify-center border border-synapz-neural/20 px-6 text-sm"
        >
          Ver todos ({drafts} rascunho{drafts === 1 ? "" : "s"})
        </Link>
      </div>

      <div className="border border-synapz-neural/10 p-5 text-sm text-synapz-signal leading-relaxed">
        <p className="eyebrow text-synapz-impulse mb-3">Como usar</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Crie ou edite um projeto em Projetos.</li>
          <li>Envie capa, imagens e vídeos pelo upload (ou cole a URL).</li>
          <li>Marque “Publicado” para aparecer em /projetos.</li>
          <li>Os arquivos ficam em <code>public/media/projects/uploads/</code>.</li>
        </ol>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-synapz-neural/10 bg-synapz-graphite p-5">
      <p className="eyebrow text-synapz-signal">{label}</p>
      <p className="mt-2 font-display text-3xl text-synapz-neural">{value}</p>
    </div>
  );
}
