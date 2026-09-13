import type { Piece } from '../types';
import { c } from '../c';

export const bureau: Piece = {
  id: 'bureau',
  numero: 2,
  nom: 'Le Bureau',
  notion: 'Boucles et tri — while, tableaux',
  minutes: 15,
  fond: '/pieces/02-fond.webp',
  arrivee: `Un bureau en désordre, une lampe à abat-jour vert encore allumée. Le
Minitel sur le coin de la table ronronne doucement — il n'a pas été éteint depuis des
années.

Le tableau au mur est de travers. Personne ne laisse un tableau de travers dans une
pièce aussi maniaque.`,
  objets: [
    {
      id: 'tableau',
      nom: 'Le tableau de travers',
      zone: { x: 66, y: 18, l: 20, h: 24 },
      examen: `Je le fais pivoter. Derrière : un coffre-fort encastré, cadran à quatre
chiffres, poignée massive. Le plâtre est fendu tout autour — on l'a posé à la va-vite.`,
      zoom: '/pieces/02-bureau/objet-coffre-mural.webp',
    },
    {
      id: 'corbeille',
      nom: 'La corbeille à papier',
      zone: { x: 12, y: 68, l: 14, h: 20 },
      examen: `Des boules de papier, toutes vierges. Une seule feuille est écrite,
déchirée en travers. Il en reste ceci :

  « … et je les range TOUJOURS par ordre croissant. Si un jour tu trouves
    la bibliothèque en désordre, c'est que je n'étais plus moi-même. »`,
    },
    {
      id: 'etagere',
      nom: "L'étagère",
      zone: { x: 4, y: 22, l: 22, h: 40 },
      examen: `Quatre livres dépassent de la rangée, chacun d'une couleur différente.
Sur chaque dos, un chiffre gravé au fer.

  vert 9   ·   rouge 4   ·   bleu 1   ·   ocre 8

Ils sont dans cet ordre-là sur l'étagère. Dans cet ordre-là, précisément.`,
      zoom: '/pieces/02-bureau/zoom-etagere.webp',
    },
    {
      id: 'minitel',
      nom: 'Le Minitel',
      zone: { x: 40, y: 46, l: 18, h: 22 },
      examen: `L'écran s'anime dès que je m'assois. Il ne demande pas un mot de passe :
il demande un programme.`,
      exercice: {
        id: 'bureau-tri',
        notion: 'Boucles while, tableaux, échange de valeurs',
        invite: 'DONNE-MOI CES QUATRE NOMBRES DANS L’ORDRE.',
        consigne: `Écris **ft_trier**, qui range un tableau d'entiers par ordre
croissant, sur place.

\`\`\`c
void	ft_trier(int *tab, int taille);
\`\`\`

Le Minitel a déjà les quatre nombres. Il te rendra la suite triée, collée d'un bloc —
et c'est elle qu'attend le cadran du coffre.

Rappel de la Norme : pas de \`for\`. Une boucle, en C de piscine, c'est \`while\`.`,
        squelette: c`
          void	ft_trier(int *tab, int taille)
          {
              int	i;
              int	j;
              int	tmp;

              i = 0;
              while (i < taille)
              {
                  /* Compare tab[i] avec ce qui suit, et échange s'il le faut. */
                  i++;
              }
          }
        `,
        harnais: c`
          #include <stdio.h>

          int	main(void)
          {
              int	livres[4];
              int	i;

              livres[0] = 9;
              livres[1] = 4;
              livres[2] = 1;
              livres[3] = 8;
              ft_trier(livres, 4);
              i = 0;
              while (i < 4)
                  printf("%d", livres[i++]);
              printf("\n");
              return (0);
          }
        `,
        attendu: '1489',
      },
    },
  ],
  verrou: {
    type: 'code',
    longueur: 4,
    empreinte: 'c701d3cb17066198f1eabe34f1269db7f9a76213ab749099fb167ac2c61b2446',
    intitule: 'Le coffre-fort mural',
  },
  sortie: `Le cadran cède avec un claquement sec. Dans le coffre : une clé en fer, longue
et grossière — une clé de cave — et une photographie que je glisse dans ma poche sans la
regarder.`,
  indices: [
    `Les quatre livres portent des chiffres, et le mot déchiré dit dans quel ordre
Séverin range. Le coffre veut cet ordre-là.`,
    `Le tri le plus simple tient en deux boucles imbriquées : pour chaque case, cherche
plus petit derrière, et échange. Deux \`while\`, pas de \`for\`.`,
    `Boucle i de 0 à taille, boucle j de i+1 à taille, et si tab[j] < tab[i], on échange
par une variable temporaire. La sortie sera 1489.`,
  ],
};
