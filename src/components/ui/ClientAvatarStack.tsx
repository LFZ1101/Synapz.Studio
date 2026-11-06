import Image from "next/image";
import { clients } from "@/content/clients";
import { cn } from "@/lib/utils";

type Props = {
  count?: number;
  className?: string;
  label?: string;
};

/** Overlapping client marks — social proof near conversion copy. */
export function ClientAvatarStack({
  count = 5,
  className,
  label,
}: Props) {
  const marks = clients.filter((c) => c.published).slice(0, count);

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="flex -space-x-2.5">
        {marks.map((client) => (
          <span
            key={client.id}
            className="relative inline-flex h-9 w-9 overflow-hidden rounded-full border-2 border-synapz-black bg-synapz-graphite ring-1 ring-synapz-neural/15"
            title={client.name}
          >
            <Image
              src={client.logo}
              alt=""
              fill
              className="object-contain p-1.5"
              sizes="36px"
            />
          </span>
        ))}
      </div>
      {label ? (
        <span className="text-sm text-synapz-signal">{label}</span>
      ) : null}
    </div>
  );
}
