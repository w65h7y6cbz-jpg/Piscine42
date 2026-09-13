import type { Piece } from '../types';
import { c } from '../c';

export const cave: Piece = {
  id: 'cave',
  numero: 6,
  nom: 'La Cave',
  notion: 'Allocation dynamique — malloc et free',
  minutes: 18,
  fond: '/pieces/06-cave/fond.webp',
  arrivee: `L'eau monte. Pas vite — un demi-centimètre depuis que je suis entré — mais
elle monte, et la seule ampoule pend à trente centimètres de la surface.

Des cartons détrempés partout. Une vanne en fonte sur le mur du fond, grippée. Et un
compteur d'eau en laiton dont l'aiguille tremble.`,
  objets: [
    {
      id: 'registre',
      nom: "Le registre d'inventaire",
      zone: { x: 24, y: 56, l: 16, h: 14 },
      examen: `Un grand livre à colonnes, gonflé d'humidité. Les pages sont couvertes de
marques illisibles, sauf la dernière, écrite plus fort :

  « Ce qu'on emprunte à la maison, on le lui rend.
    Elle tient les comptes mieux que moi.
    Ce qui n'est pas rendu, elle le garde — et elle se remplit. »`,
    },
    {
      id: 'carton',
      nom: 'Le carton du dessus',
      zone: { x: 60, y: 42, l: 18, h: 20 },
      examen: `Des câbles, des transformateurs, une alimentation éventrée. Et posé
dessus, à l'abri de l'eau, un boîtier gris avec un écran : la même machine que partout
ailleurs, mais celle-ci est alimentée par la vanne.`,
      exercice: {
        id: 'cave-strdup',
        notion: 'malloc, free, copie de chaîne',
        invite: 'COPIE-MOI CE QUE JE TE DONNE. ET RENDS-MOI LA PLACE.',
        consigne: `Écris **ft_strdup**, qui rend une copie fraîche d'une chaîne.

\`\`\`c
char	*ft_strdup(char *src);
\`\`\`

C'est le premier exercice où tu demandes de la mémoire à la machine. Trois temps :

1. **Mesurer** — combien de caractères, plus un pour le \`'\\0'\` final.
2. **Demander** — \`malloc(taille)\`, et vérifier que ça n'a pas rendu \`NULL\`.
3. **Copier** — caractère par caractère, sans oublier de terminer par \`'\\0'\`.

La machine libérera la copie après l'avoir lue. Si tu n'as pas alloué exactement ce
qu'il fallait, la cave continuera de se remplir.`,
        squelette: c`
          #include <stdlib.h>

          int	ft_strlen(char *s)
          {
              int	i;

              i = 0;
              while (s[i])
                  i++;
              return (i);
          }

          char	*ft_strdup(char *src)
          {
              char	*copie;
              int	i;

              /* Mesure, demande la place, copie, et n'oublie pas le zéro final. */
              return (NULL);
          }
        `,
        harnais: c`
          #include <stdio.h>
          #include <stdlib.h>

          int	main(void)
          {
              char	*copie;

              copie = ft_strdup("1793");
              if (!copie)
                  return (1);
              printf("%s\n", copie);
              free(copie);
              return (0);
          }
        `,
        attendu: '1793',
      },
    },
    {
      id: 'vanne',
      nom: 'La vanne',
      zone: { x: 78, y: 44, l: 14, h: 20 },
      examen: `Le volant est bloqué par la rouille. Un cadran mécanique à quatre chiffres
est soudé sur le corps de la vanne : elle ne tournera qu'au bon nombre.`,
    },
    {
      id: 'compteur',
      nom: "Le compteur d'eau",
      zone: { x: 8, y: 34, l: 12, h: 14 },
      examen: `L'aiguille tourne. Le cadran n'a pas de chiffres, seulement des traits —
mais je vois bien qu'elle accélère.

Je n'ai pas des heures.`,
      zoom: '/pieces/06-cave/zoom-compteur-eau.webp',
    },
  ],
  verrou: {
    type: 'code',
    longueur: 4,
    empreinte: 'aab63c199460d0c419ef262a2fc4bd4c5bdc355ee53f51807df694e74a93c680',
    intitule: 'Le cadran de la vanne',
  },
  sortie: `Le volant se débloque d'un coup. L'eau reflue par où elle était venue, en
tirant les cartons vers le siphon. Sur le mur qu'elle découvre : une trappe, et une
échelle qui monte.`,
  indices: [
    `La machine du carton ne demande pas un code : elle demande une copie. C'est elle
qui donnera le nombre de la vanne.`,
    `ft_strlen(src) + 1 : le +1 est pour le \`'\\0'\`. C'est l'oubli le plus fréquent de
la piscine, et il ne prévient pas — il corrompt.`,
    `copie = malloc(ft_strlen(src) + 1) ; si NULL, on rend NULL ; on recopie caractère
par caractère, puis copie[i] = '\\0'. Le cadran veut 1793.`,
  ],
};
