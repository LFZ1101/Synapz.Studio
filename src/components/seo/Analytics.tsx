/**
 * Analytics bootstrap — intentionally inactive until consent/privacy review.
 * Set NEXT_PUBLIC_GA_ID and render <Analytics /> after approval.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  // Placeholder: do not load scripts until consent flow exists.
  return (
    <script
      type="application/json"
      id="synapz-analytics-config"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          provider: "ga4",
          id,
          status: "configured-but-not-loaded",
          note: "Implement consent gate before injecting ga scripts.",
        }),
      }}
    />
  );
}
