import type { Piece } from '../types';
import { c } from '../c';

export const bibliotheque: Piece = {
  id: 'bibliotheque',
  numero: 3,
  nom: 'La Bibliothèque',
  notion: 'Chaînes de caractères — le zéro terminal',
  minutes: 15,
  fond: '/pieces/06-fond.webp',
  arrivee: `Des rayonnages du sol au plafond, un fauteuil creusé par des années de
lectures, un feu qui achève de mourir. L'air sent la colle et le vieux papier.

Une porte au fond, fermée par un cadran à lettres. Sept lettres.`,
  objets: [
    {
      id: 'carnet',
      nom: 'Le carnet ouvert',
      zone: { x: 34, y: 58, l: 18, h: 16 },
      examen: `Une écriture serrée, illisible, sauf trois lignes tracées plus lentement
que le reste :

  « Le mot de passe est mon prénom.
    Mais la maison le lit à l'envers,
    parce que la maison ne sait lire que dans un sens. »`,
    },
    {
      id: 'loupe',
      nom: 'La loupe',
      zone: { x: 62, y: 62, l: 12, h: 12 },
      examen: `Une loupe à monture de laiton, la lentille rayée. Utile pour ce qui est
petit — inutile pour ce qui est invisible.`,
      donne: ['loupe'],
    },
    {
      id: 'lampe-uv',
      nom: 'La lampe noire',
      zone: { x: 76, y: 44, l: 11, h: 14 },
      examen: `Une lampe à ultraviolets, du plastique noir et lourd. Elle fonctionne
encore. Je la promène sur les murs.

Au-dessus du fauteuil, l'encre invisible s'allume d'un bleu froid : sept lettres,
tracées à la main.

  N I R E V E S`,
      donne: ['lampe-uv'],
      zoom: '/pieces/03-bibliotheque/zoom-mur-uv.webp',
    },
    {
      id: 'globe',
      nom: 'Le globe',
      zone: { x: 14, y: 52, l: 16, h: 22 },
      examen: `Un globe terrestre monté sur pied. Il s'ouvre en deux à l'équateur.
Dedans, une machine de la taille d'une boîte à chaussures : un clavier, un écran, et
un curseur qui bat.`,
      exercice: {
        id: 'biblio-strrev',
        notion: 'Chaînes C, indices, le caractère nul',
        invite: 'JE NE SAIS LIRE QUE DANS UN SENS. RETOURNE-LE POUR MOI.',
        consigne: `Écris **ft_strrev**, qui renverse une chaîne sur place et la renvoie.

\`\`\`c
char	*ft_strrev(char *s);
\`\`\`

Une chaîne C n'a pas de longueur : elle s'arrête au caractère \`'\\0'\`. Pour la
renverser, il faut d'abord savoir où elle finit — donc la parcourir.

La machine te donnera ce qu'elle lit sur le mur. Ce sera le mot du cadran.`,
        squelette: c`
          int	ft_strlen(char *s)
          {
              int	i;

              i = 0;
              while (s[i])
                  i++;
              return (i);
          }

          char	*ft_strrev(char *s)
          {
              /* Deux indices : un au début, un à la fin. Rapproche-les. */
              return (s);
          }
        `,
        harnais: c`
          #include <stdio.h>

          int	main(void)
          {
              char	mur[] = "NIREVES";

              printf("%s\n", ft_strrev(mur));
              return (0);
          }
        `,
        attendu: 'SEVERIN',
      },
    },
  ],
  verrou: {
    type: 'lettres',
    longueur: 7,
    empreinte: '478f2dd77b8414ff0406746695aeddd2510562f4f9b19764f0e43d81f455c7ed',
    intitule: 'La porte du fond',
  },
  sortie: `Les sept barillets s'alignent. La porte s'ouvre sur un escalier qui monte —
et sur une odeur de renfermé, de tissu et de naphtaline.`,
  indices: [
    `La lampe noire ne sert pas à voir les livres. Elle sert à voir les murs.`,
    `Pour renverser une chaîne, place un indice au début, un autre sur le dernier
caractère — attention, pas sur le \`'\\0'\` — et échange-les en les rapprochant.`,
    `i = 0 ; j = ft_strlen(s) - 1 ; tant que i < j, on échange s[i] et s[j] par une
variable temporaire, i++ et j--. Le mur dit NIREVES, le cadran veut SEVERIN.`,
  ],
};
