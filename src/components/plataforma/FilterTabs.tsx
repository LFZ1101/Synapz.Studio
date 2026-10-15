import Link from "next/link";

export function FilterTabs({
  items,
  active,
  basePath,
  param = "filtro",
}: {
  items: Array<{ value: string; label: string; count?: number }>;
  active: string;
  basePath: string;
  param?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const href =
          item.value === items[0]?.value
            ? basePath
            : `${basePath}?${param}=${item.value}`;
        const isActive = active === item.value;
        return (
          <Link
            key={item.value}
            href={href}
            className={`platform-chip ${isActive ? "is-active" : ""}`}
          >
            {item.label}
            {typeof item.count === "number" ? (
              <span className="font-mono text-[0.7rem] opacity-70">{item.count}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
