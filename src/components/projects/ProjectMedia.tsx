import Image from "next/image";

type GalleryImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
};

/** Full-bleed gallery image — never crops artwork. */
export function ProjectGalleryImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width:768px) 100vw, 90vw",
}: GalleryImageProps) {
  return (
    <div className="bg-synapz-black border border-synapz-neural/10 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={2400}
        height={1600}
        priority={priority}
        sizes={sizes}
        className="mx-auto block h-auto w-full object-contain"
        style={{ width: "100%", height: "auto", aspectRatio: "auto" }}
      />
    </div>
  );
}

type GalleryVideoProps = {
  src: string;
  poster?: string;
  label?: string;
};

/** Responsive video frame that keeps the full frame visible. */
export function ProjectGalleryVideo({ src, poster, label }: GalleryVideoProps) {
  return (
    <div className="flex items-center justify-center bg-synapz-black border border-synapz-neural/10 overflow-hidden px-2 py-3 sm:px-4 sm:py-4">
      <video
        className="mx-auto max-h-[75vh] w-auto max-w-full h-auto"
        controls
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

type CoverProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** Hero cover — contain so branding/mockups are not cropped. */
export function ProjectCoverImage({ src, alt, priority = false }: CoverProps) {
  return (
    <div className="flex items-center justify-center bg-synapz-black border border-synapz-neural/10 overflow-hidden min-h-[200px]">
      <Image
        src={src}
        alt={alt}
        width={2400}
        height={1350}
        priority={priority}
        sizes="100vw"
        className="mx-auto block h-auto w-full max-h-[70vh] md:max-h-[75vh] object-contain"
        style={{ width: "100%", height: "auto", aspectRatio: "auto" }}
      />
    </div>
  );
}
