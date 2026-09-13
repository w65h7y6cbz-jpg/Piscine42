import type { Piece } from '../types';
import { c } from '../c';

export const chambre: Piece = {
  id: 'chambre',
  numero: 4,
  nom: 'La Chambre',
  notion: 'Pointeurs — passer une adresse',
  minutes: 15,
  fond: '/pieces/12-fond.webp',
  arrivee: `Un lit fait, une couverture à fleurs passées, une armoire à miroir
entrouverte. Rien n'a bougé ici depuis longtemps, et pourtant il n'y a pas de poussière
sur la commode.

Sur la commode, un petit coffret en marqueterie. Trois barillets à lettres.`,
  objets: [
    {
      id: 'miroir',
      nom: 'Le miroir',
      zone: { x: 58, y: 20, l: 18, h: 50 },
      examen: `Le tain est piqué de noir sur les bords. Quelqu'un a écrit trois lettres
au savon en haut à droite de la glace. De face, elles ne veulent rien dire.

Dans le reflet, elles se lisent :

  L U N`,
      zoom: '/pieces/04-chambre/objet-miroir.webp',
    },
    {
      id: 'lettres',
      nom: 'Le paquet de lettres',
      zone: { x: 20, y: 60, l: 16, h: 14 },
      examen: `Une quinzaine d'enveloppes liées par un ruban rouge. Toutes vierges.
Sur la dernière, au dos, une phrase écrite au crayon :

  « Ce ne sont pas les lettres qui bougent. Ce sont leurs places. »`,
    },
    {
      id: 'tiroir',
      nom: 'Le tiroir de la commode',
      zone: { x: 32, y: 70, l: 20, h: 16 },
      examen: `Des gants pliés, une montre arrêtée, et une petite clé plate en laiton
au fond, coincée sous le papier journal.`,
      donne: ['cle-plate'],
      zoom: '/pieces/04-chambre/zoom-tiroir.webp',
    },
    {
      id: 'coffret',
      nom: 'Le coffret à bijoux',
      zone: { x: 38, y: 52, l: 14, h: 12 },
      requiert: 'cle-plate',
      refus: `Le coffret est verrouillé, et le trou de serrure est minuscule. Il me faut
une clé plate, très fine.`,
      examen: `La clé plate ouvre la serrure, mais le coffret ne s'ouvre pas pour autant :
sous le couvercle, une seconde mécanique, et une plaquette de cuivre gravée. Une machine
minuscule, montée dans le bois.`,
      exercice: {
        id: 'chambre-swap',
        notion: 'Pointeurs, passage par adresse',
        invite: 'JE NE PEUX PAS BOUGER LES LETTRES. BOUGE-LES POUR MOI.',
        consigne: `Écris **ft_swap**, qui échange deux caractères dont on lui donne
les adresses.

\`\`\`c
void	ft_swap(char *a, char *b);
\`\`\`

C'est l'exercice qui fait comprendre les pointeurs, ou qui fait rater la piscine.
Une fonction ne reçoit jamais tes variables : elle en reçoit des copies. Pour qu'elle
modifie l'original, il faut lui donner **où il habite** — son adresse — et déréférencer
avec \`*\` pour atteindre la valeur.

La machine passera à ft_swap les adresses de deux lettres du miroir.`,
        squelette: c`
          void	ft_swap(char *a, char *b)
          {
              char	tmp;

              /* a et b sont des adresses. *a et *b sont les caractères qui y vivent. */
          }
        `,
        harnais: c`
          #include <stdio.h>

          int	main(void)
          {
              char	mot[] = "LUN";

              ft_swap(&mot[0], &mot[2]);
              printf("%s\n", mot);
              return (0);
          }
        `,
        attendu: 'NUL',
      },
    },
  ],
  verrou: {
    type: 'lettres',
    longueur: 3,
    empreinte: '8de75e6ccc30b2945af433a023020f8a6c8e306a5c4ce7abfb13c9194367a8d6',
    intitule: 'Les trois barillets du coffret',
  },
  sortie: `Le couvercle se soulève. Pas de bijoux : une clé à molette, un plan plié en
huit, et une carte de visite vierge.

Trois lettres. Son nom. Il avait fini par s'appeler comme ce qu'il craignait le plus.`,
  indices: [
    `Le miroir inverse l'ordre, il n'invente rien. Et la lettre écrite dit que ce sont
les places qui bougent, pas les lettres.`,
    `\`char *a\` veut dire « a contient l'adresse d'un caractère ». \`*a\` est ce
caractère. Pour échanger, il faut une variable temporaire.`,
    `tmp = *a ; *a = *b ; *b = tmp ; — et LUN devient NUL.`,
  ],
};
