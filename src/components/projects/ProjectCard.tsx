import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  priority?: boolean;
  ctaLabel?: string;
};

export function ProjectCard({
  project,
  priority = false,
  ctaLabel = "Ver o projeto",
}: Props) {
  const galleryVideos = project.gallery.filter(
    (item) => item.video || item.youtube,
  );
  const galleryImages = project.gallery.filter((item) => item.src);
  const isVideoProject =
    galleryVideos.length > 0 && galleryImages.length === 0;

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group surface-panel surface-panel-hover flex h-full flex-col overflow-hidden focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-synapz-black">
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            priority={priority}
            className="object-contain transition duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-synapz-black/60 via-transparent to-transparent" />
        {isVideoProject ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 border border-white/10 bg-synapz-black/75 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-synapz-neural backdrop-blur-sm">
            <span aria-hidden>▶</span> Vídeo
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4 md:p-5">
        <p className="eyebrow text-[0.65rem] md:text-xs">
          {project.segment} · {project.year}
        </p>
        <h3 className="font-display text-xl md:text-2xl leading-tight text-synapz-neural transition-colors group-hover:text-synapz-impulse">
          {project.name}
        </h3>
        <p className="text-sm text-synapz-signal leading-relaxed line-clamp-2">
          {project.summary}
        </p>
        <span className="mt-auto pt-4 inline-flex min-h-11 items-center gap-2 text-sm text-synapz-impulse">
          {ctaLabel}
          <span
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
