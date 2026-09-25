/**
 * Client logos for the home social-proof strip.
 * Only real clients with authorization to display the mark.
 */

export type ClientLogo = {
  id: string;
  name: string;
  logo: string;
  url?: string;
  published: boolean;
};

export const clients: ClientLogo[] = [
  {
    id: "ceriani-craveiro",
    name: "Ceriani Craveiro Imóveis",
    logo: "/media/clients/ceriani-craveiro.png",
    published: true,
  },
  {
    id: "dunamis-wear",
    name: "Dunamis Wear",
    logo: "/media/clients/dunamis-wear.png",
    published: true,
  },
  {
    id: "emporio-verona",
    name: "Empório Verona Vet Care",
    logo: "/media/clients/emporio-verona.png",
    published: true,
  },
  {
    id: "oliver-eventos",
    name: "Oliver Eventos",
    logo: "/media/clients/oliver-eventos.png",
    published: true,
  },
  {
    id: "triad-caps",
    name: "Tríad Caps",
    logo: "/media/clients/triad-caps.png",
    published: true,
  },
  {
    id: "viane-brasil",
    name: "Viane Brasil",
    logo: "/media/clients/viane-brasil.png",
    published: true,
  },
];

export function getPublishedClients(): ClientLogo[] {
  return clients.filter((c) => c.published);
}
