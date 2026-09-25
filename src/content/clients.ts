/**
 * Client logos for the home social-proof strip.
 * Only add real clients with authorization to display the mark.
 * Place logo files in /public/media/clients/
 *
 * Prefer SVG or PNG with transparent background.
 * For dark backgrounds, white/monochrome versions work best.
 */

export type ClientLogo = {
  /** URL-safe id, also used as default filename stem */
  id: string;
  name: string;
  /** Path under /public — e.g. /media/clients/acme.svg */
  logo: string;
  /** Optional link to client site */
  url?: string;
  published: boolean;
};

export const clients: ClientLogo[] = [
  // Example (do not invent — replace with real authorized marks):
  // {
  //   id: "exemplo",
  //   name: "Nome do cliente",
  //   logo: "/media/clients/exemplo.svg",
  //   published: true,
  // },
];

export function getPublishedClients(): ClientLogo[] {
  return clients.filter((c) => c.published);
}
