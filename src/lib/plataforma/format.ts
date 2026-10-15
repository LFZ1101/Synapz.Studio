import type { PeriodFilter } from "./types";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const numberFmt = new Intl.NumberFormat("pt-BR");

export function centsToNumber(cents: number) {
  return cents / 100;
}

export function numberToCents(value: number) {
  return Math.round(value * 100);
}

export function parseMoneyInput(raw: string | number | null | undefined) {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  if (!raw) return 0;
  const cleaned = String(raw)
    .trim()
    .replace(/\s/g, "")
    .replace(/R\$/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(cents: number, hide = false) {
  if (hide) return "••••";
  return brl.format(centsToNumber(cents));
}

export function formatNumber(value: number, hide = false) {
  if (hide) return "••";
  return numberFmt.format(value);
}

export function formatPercent(value: number, hide = false) {
  if (hide) return "••%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

export function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function periodRange(period: PeriodFilter, now = new Date()) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);

  switch (period) {
    case "hoje":
      start.setHours(0, 0, 0, 0);
      break;
    case "7d":
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case "1m":
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "3m":
      start.setMonth(start.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      break;
    case "6m":
      start.setMonth(start.getMonth() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case "1a":
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return { start: start.toISOString(), end: end.toISOString() };
}

export function previousPeriodRange(period: PeriodFilter, now = new Date()) {
  const { start, end } = periodRange(period, now);
  const startDate = new Date(start);
  const endDate = new Date(end);
  const duration = endDate.getTime() - startDate.getTime();
  const prevEnd = new Date(startDate.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);
  return { start: prevStart.toISOString(), end: prevEnd.toISOString() };
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}
