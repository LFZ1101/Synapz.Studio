import { PageHeader } from "@/components/plataforma/PageHeader";
import { requireUser } from "@/lib/plataforma/auth";

export const metadata = { title: "SYNAPZ Play" };

const VIDEOS = [
  {
    title: "Intro SYNAPZ — desktop",
    src: "/media/videos/intro-synapz-desktop.mp4",
    note: "Apresentação cinematográfica da marca",
  },
  {
    title: "Intro SYNAPZ — mobile",
    src: "/media/videos/intro-synapz-mobile.mp4",
    note: "Versão vertical para redes e mobile",
  },
  {
    title: "Studio SYNAPZ",
    src: "/media/videos/studio-synapz.mp4",
    note: "Atmosfera e processo do estúdio",
  },
];

export default async function PlayPage() {
  await requireUser();

  return (
    <div>
      <PageHeader
        eyebrow="Ferramentas"
        title="SYNAPZ Play"
        description="Biblioteca de vídeos oficiais da SYNAPZ para alinhar equipe e comunicação. Conteúdo próprio — sem acervo de terceiros."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {VIDEOS.map((video) => (
          <article key={video.src} className="platform-panel">
            <p className="eyebrow mb-2">Vídeo</p>
            <h2 className="font-display text-xl">{video.title}</h2>
            <p className="mt-1 text-sm text-synapz-signal">{video.note}</p>
            <video
              className="mt-4 w-full rounded-[16px_6px] border border-white/10"
              controls
              preload="metadata"
              src={video.src}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
