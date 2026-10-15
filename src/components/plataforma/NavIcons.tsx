import type { NavIcon } from "./nav";

export function NavIcons({ name, className }: { name: NavIcon; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "overview":
      return (
        <svg {...common}>
          <path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z" />
        </svg>
      );
    case "clients":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M16 19c.4-1.8 1.8-3 3.8-3" />
        </svg>
      );
    case "crm":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="5" height="16" rx="1" />
          <rect x="10" y="4" width="5" height="16" rx="1" />
          <rect x="17" y="4" width="4" height="16" rx="1" />
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <path d="M4 7h16v12H4V7Z" />
          <path d="M8 7V5h8v2" />
        </svg>
      );
    case "tasks":
      return (
        <svg {...common}>
          <path d="M9 7h11M9 12h11M9 17h11" />
          <path d="M4 7h1M4 12h1M4 17h1" />
        </svg>
      );
    case "sales":
      return (
        <svg {...common}>
          <path d="M4 18V6" />
          <path d="M4 18h16" />
          <path d="M7 14l4-5 3 3 5-7" />
        </svg>
      );
    case "cash":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "portfolio":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 15l5-4 4 3 3-2 6 4" />
        </svg>
      );
    case "team":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 19c0-3.2 3-5 7-5s7 1.8 7 5" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M4.9 6.5l1.4 1.4M17.7 16.1l1.4 1.4M3 12h2M19 12h2M4.9 17.5l1.4-1.4M17.7 7.9l1.4-1.4" />
        </svg>
      );
  }
}
