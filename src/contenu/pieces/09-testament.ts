import type { Piece } from '../types';
import { c } from '../c';

export const testament: Piece = {
  id: 'testament',
  numero: 9,
  nom: 'Le Testament',
  notion: 'La Norme — et tout le reste',
  minutes: 25,
  fond: '/pieces/09-testament/fond.webp',
  arrivee: `Une pièce nue, sous la cave. Du plâtre brut, une ampoule qui oscille, rien
au mur.

Au fond : une porte d'acier rivetée, un volant à rayons, trois serrures en colonne.
Devant elle, une table, et sur la table une machine en laiton et bois noir qui n'a rien à
faire dans cette maison ni dans ce siècle.

Sous la porte, un trait de gris. Le jour se lève.`,
  objets: [
    {
      id: 'porte',
      nom: "La porte d'acier",
      zone: { x: 34, y: 20, l: 32, h: 56 },
      examen: `Trois serrures de formes différentes, et aucune n'a de trou pour une clé
que je possède. Sous la troisième, une plaque de laiton, gravée cette fois :

  « Elle ne s'ouvre pas avec ce qu'on a.
    Elle s'ouvre avec ce qu'on a appris. »`,
      zoom: '/pieces/09-testament/zoom-serrure.webp',
    },
    {
      id: 'enveloppe',
      nom: "L'enveloppe cachetée",
      zone: { x: 12, y: 58, l: 16, h: 14 },
      examen: `Une grande enveloppe crème, fermée d'un cachet de cire rouge frappé d'une
spirale. Aucun nom.

Elle ne s'ouvrira pas avant la porte. C'est manifestement l'ordre prévu.`,
      donne: ['enveloppe-scellee'],
    },
    {
      id: 'machine-notaire',
      nom: 'La machine',
      zone: { x: 44, y: 62, l: 22, h: 20 },
      examen: `Laiton, bois noir, un écran rond gros comme une pièce de cinq francs, un
levier, et une fente à la taille d'une enveloppe. Elle attend un dernier programme.`,
      exercice: {
        id: 'testament-norme',
        notion: 'La Norme 42',
        norme: true,
        invite: 'CE PROGRAMME EST JUSTE. IL EST MAL ÉCRIT. CORRIGE-LE.',
        consigne: `La machine te donne un programme qui **fonctionne déjà** : il affiche
\`AUBE\`, le dernier mot.

Mais il est écrit n'importe comment, et cette porte-là ne s'ouvre pas devant du code hors
Norme. Réécris-le pour qu'il affiche toujours \`AUBE\` **et** qu'il passe la Norme.

Ce que la Norme refuse, et que ce programme fait :

- la boucle \`for\` — en piscine, on n'écrit que des \`while\` ;
- l'opérateur ternaire \`? :\` ;
- l'indentation à l'espace — ce sont des tabulations, toujours ;
- les lignes de plus de 80 colonnes ;
- plus de 25 lignes dans une fonction, plus de 4 paramètres, plus de 5 fonctions
  par fichier.

C'est la dernière serrure, et c'est celle sur laquelle on perd le plus de points en
piscine : pas parce que le code est faux, mais parce qu'il est mal mis.`,
        squelette: c`
          #include <stdio.h>

          int main(void) {
              char *mot = "AUBE";
              for (int i = 0; i < 4; i++) { printf("%c", mot[i] != 0 ? mot[i] : '?'); }
              printf("\n");
              return 0;
          }
        `,
        harnais: '',
        attendu: 'AUBE',
      },
    },
  ],
  verrou: {
    type: 'lettres',
    longueur: 4,
    empreinte: '2f08a99bf8bbeafade8d237d9a6ada7a4c2c3e06bf99532a2fcf6164377bfc1b',
    intitule: 'Les trois serrures',
  },
  sortie: `Les trois serrures se retirent l'une après l'autre, dans l'ordre. Le volant
tourne tout seul.

Derrière la porte : un escalier étroit, et tout en haut, le rectangle bleu du petit
matin sur l'herbe du jardin.

Le cachet de cire se brise dans ma poche pendant que je monte.`,
  indices: [
    `Le programme n'a pas besoin d'être réécrit dans son idée, seulement dans sa forme.
Garde ce qu'il fait, change comment il le dit.`,
    `Un \`for\` se traduit toujours en trois morceaux : l'initialisation avant la boucle,
la condition dans le \`while\`, l'incrément à la fin du corps. Le ternaire, lui, redevient
un \`if\`... ou disparaît, parce qu'il ne servait à rien.`,
    `\`int main(void)\` suffit — quatre paramètres inutiles, c'est déjà un écart. Puis
une variable \`i\` déclarée en tête, une boucle \`while (i < 4)\`, un printf du tableau
"AUBE", des tabulations partout, et rien au-delà de 80 colonnes.`,
  ],
};
