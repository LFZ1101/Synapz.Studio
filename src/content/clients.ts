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
  {
    id: "gabriel-lebre",
    name: "Gabriel Lebre",
    logo: "/media/clients/gabriel-lebre.png",
    published: true,
  },
  {
    id: "aegis-tech",
    name: "Aegis Tech",
    logo: "/media/clients/aegis-tech.png",
    published: true,
  },
  {
    id: "perez-coelho",
    name: "Perez Coelho Negócios Imobiliários",
    logo: "/media/clients/perez-coelho.png",
    published: true,
  },
  {
    id: "djeduh",
    name: "DJEDUH",
    logo: "/media/clients/djeduh.png",
    published: true,
  },
  {
    id: "kings-ranch",
    name: "Kings Ranch",
    logo: "/media/clients/kings-ranch.png",
    published: true,
  },
  {
    id: "open-tennis",
    name: "Open Tennis e Beach Tennis Club",
    logo: "/media/clients/open-tennis.png",
    published: true,
  },
  {
    id: "piperhub",
    name: "PiperHub",
    logo: "/media/clients/piperhub.png",
    published: true,
  },
  {
    id: "torqx",
    name: "Torqx Acessórios",
    logo: "/media/clients/torqx.png",
    published: true,
  },
  {
    id: "mafia-do-churrasco",
    name: "Máfia do Churrasco",
    logo: "/media/clients/mafia-do-churrasco.png",
    published: true,
  },
];

export function getPublishedClients(): ClientLogo[] {
  return clients.filter((c) => c.published);
}
