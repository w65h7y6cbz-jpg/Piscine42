import type { Piece } from '../types';
import { c } from '../c';

export const hall: Piece = {
  id: 'hall',
  numero: 1,
  nom: 'Le Hall',
  notion: 'Premier programme — main, printf',
  minutes: 12,
  fond: '/pieces/01-hall/fond.webp',
  arrivee: `Le volet roulant est descendu derrière toi pendant que tu regardais
ailleurs. La porte d'entrée ne bouge plus. Il n'y a qu'une ampoule allumée dans tout
le hall, et elle clignote.

Sur le mur, un interphone beige des années quatre-vingt. Son petit écran est allumé.`,
  objets: [
    {
      id: 'interphone',
      nom: "L'interphone",
      zone: { x: 6, y: 38, l: 13, h: 20 },
      examen: `Ce n'est pas un interphone. Quelqu'un a remplacé les entrailles par une
carte électronique et un écran minuscule. Il attend qu'on lui écrive quelque chose.`,
      exercice: {
        id: 'hall-bonsoir',
        notion: 'printf, main, valeur de retour',
        invite: 'DIS-MOI BONSOIR ET APPELLE-MOI PAR MON NOM.',
        consigne: `La maison veut s'entendre saluer. Écris un programme qui affiche
exactement **BONSOIR SEVERIN**, suivi d'un retour à la ligne.

C'est le programme le plus court de toute la villa. Profites-en.`,
        squelette: c`
          #include <stdio.h>

          int	main(void)
          {
              /* À toi. Deux mots, en majuscules, puis un retour à la ligne. */
              return (0);
          }
        `,
        harnais: '',
        attendu: 'BONSOIR SEVERIN',
      },
    },
    {
      id: 'tableau-electrique',
      nom: 'Le tableau électrique',
      zone: { x: 72, y: 22, l: 14, h: 18 },
      examen: `Trois disjoncteurs sur six sont abaissés. Je les relève : ils retombent
aussitôt. Quelque chose en aval décide à ma place — et ce quelque chose attend visiblement
qu'on lui parle poliment.`,
      zoom: '/pieces/01-hall/objet-tableau-electrique.webp',
    },
    {
      id: 'boite-aux-lettres',
      nom: 'La boîte aux lettres',
      zone: { x: 24, y: 44, l: 11, h: 13 },
      examen: `Du courrier jauni, jamais ouvert. Les enveloppes sont vierges : ni nom,
ni adresse, ni timbre. Quelqu'un les a postées sans jamais vouloir qu'elles arrivent.

Au fond, glissée contre la paroi, une carte perforée.`,
      donne: ['carte-perforee'],
    },
    {
      id: 'paillasson',
      nom: 'Le paillasson',
      zone: { x: 38, y: 76, l: 22, h: 16 },
      apparaitApres: 'hall-bonsoir',
      examen: `Maintenant que le hall est éclairé, je vois le rectangle de poussière
autour du paillasson. Je le soulève.

Une clé en laiton, terne, avec un anneau ouvragé. La clé du bureau, sans doute.`,
      donne: ['cle-laiton'],
      zoom: '/pieces/01-hall/zoom-paillasson.webp',
    },
  ],
  verrou: {
    type: 'objet',
    objet: 'cle-laiton',
    intitule: 'La porte du bureau',
  },
  sortie: `La clé tourne sans forcer. Derrière, un couloir court, et une odeur de
papier et de poussière chaude.`,
  indices: [
    `L'interphone est la seule chose vivante du hall. Tant qu'il n'a pas ce qu'il veut,
le reste de la maison reste éteint.`,
    `Un programme C affiche avec printf. Le retour à la ligne s'écrit \\n, et il compte :
la machine vérifie au caractère près.`,
    `printf("BONSOIR SEVERIN\\n"); — rien de plus. Et le hall s'éclaire.`,
  ],
};
