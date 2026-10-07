import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: Props) {
  const hasVideo = Boolean(
    project.video || project.gallery.some((item) => item.video || item.youtube),
  );

  return (
    <Link
      href={`/projetos/${project.slug}`}
      className="group flex h-full flex-col border border-synapz-neural/10 bg-synapz-black/40 transition-colors hover:border-synapz-impulse/40 hover:bg-synapz-black focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-synapz-graphite">
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-synapz-black/55 via-transparent to-transparent opacity-80" />
        {hasVideo ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-synapz-black/70 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-synapz-neural backdrop-blur-sm">
            <span aria-hidden>▶</span> Vídeo
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
        <p className="eyebrow text-[0.65rem] md:text-xs">
          {project.segment} · {project.year}
        </p>
        <h3 className="font-display text-xl md:text-2xl leading-tight text-synapz-neural transition-colors group-hover:text-synapz-impulse">
          {project.name}
        </h3>
        <p className="text-sm text-synapz-signal leading-relaxed line-clamp-2">
          {project.summary}
        </p>
        <span className="mt-auto pt-3 text-sm text-synapz-impulse">
          Ver projeto →
        </span>
      </div>
    </Link>
  );
}
