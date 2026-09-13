import type { Piece } from '../types';
import { c } from '../c';

export const atelier: Piece = {
  id: 'atelier',
  numero: 5,
  nom: "L'Atelier",
  notion: 'Bases et binaire — poids des bits',
  minutes: 18,
  fond: '/pieces/05-atelier/fond.webp',
  arrivee: `Le garage a été transformé en atelier d'électronique. Un établi sous une
lampe à pince, un mur d'outils, une colonne de petits tiroirs métalliques numérotés de
0000 à 9999 par groupes de quatre molettes.

Sur l'établi, une carte électronique sous tension. Huit diodes rouges. Certaines
allumées, d'autres non.`,
  objets: [
    {
      id: 'circuit',
      nom: 'La carte électronique',
      zone: { x: 36, y: 54, l: 24, h: 18 },
      examen: `Huit diodes en ligne. De gauche à droite :

  éteinte · éteinte · allumée · éteinte · allumée · éteinte · allumée · éteinte

Un interrupteur à bascule sous la rangée. Je le pousse : la rangée change.

  éteinte · allumée · éteinte · éteinte · allumée · éteinte · allumée · éteinte

Deux états. Deux nombres, sûrement — mais huit lampes ne font pas huit chiffres.`,
      zoom: '/pieces/05-atelier/zoom-circuit.webp',
    },
    {
      id: 'plan',
      nom: 'Le plan roulé',
      zone: { x: 82, y: 40, l: 10, h: 34 },
      examen: `Un bleu technique, immense. C'est le plan de la villa — sans un seul mot
écrit dessus, uniquement des traits. Une pièce y figure que je n'ai pas encore vue : tout
en bas, sous la cave.

Dans la marge, un croquis minuscule : huit petites cases, et sous elles, de droite à
gauche : 1, 2, 4, 8, 16, 32, 64, 128.`,
      donne: ['plan-villa'],
    },
    {
      id: 'casier',
      nom: 'La colonne de tiroirs',
      zone: { x: 6, y: 30, l: 18, h: 46 },
      examen: `Quatre molettes chromées, de 0 à 9 chacune. Un seul tiroir s'ouvrira, et
seulement sur le bon nombre à quatre chiffres.`,
    },
    {
      id: 'fer',
      nom: 'Le fer à souder',
      zone: { x: 62, y: 60, l: 14, h: 14 },
      examen: `Encore chaud. À côté, une machine bricolée dans un boîtier de radio-réveil :
clavier, écran, et une prise pour lire la carte électronique.`,
      exercice: {
        id: 'atelier-binaire',
        notion: 'Bases, poids des bits, conversion',
        invite: 'JE LIS DES LAMPES. JE NE SAIS PAS COMPTER.',
        consigne: `Écris **ft_binaire**, qui prend une chaîne de huit caractères
\`'0'\` et \`'1'\` et rend l'entier correspondant.

\`\`\`c
int	ft_binaire(char *bits);
\`\`\`

Un chiffre binaire vaut deux fois celui qui est à sa droite : 1, 2, 4, 8, 16, 32, 64,
128 en partant de la fin. C'est exactement ce que dit le croquis dans la marge du plan.

L'astuce qui évite de calculer les puissances : pars de 0, et pour chaque caractère de
gauche à droite, fais \`n = n * 2 + (bit vaut '1')\`.

La machine lira les deux états de la carte et collera les deux nombres. Ce sera le
numéro du tiroir.`,
        squelette: c`
          int	ft_binaire(char *bits)
          {
              int	n;
              int	i;

              n = 0;
              i = 0;
              while (bits[i])
              {
                  /* Chaque pas double ce qui précède, puis ajoute le bit courant. */
                  i++;
              }
              return (n);
          }
        `,
        harnais: c`
          #include <stdio.h>

          int	main(void)
          {
              printf("%d%d\n", ft_binaire("00101010"), ft_binaire("01001010"));
              return (0);
          }
        `,
        attendu: '4274',
      },
    },
  ],
  verrou: {
    type: 'code',
    longueur: 4,
    empreinte: 'edfa1641e2c7cf0375f076dcdad8fbc4e204def19b3fbd1c75f205e4d8bbb77f',
    intitule: 'Les quatre molettes du casier',
  },
  sortie: `Un seul tiroir coulisse, tout en bas de la colonne. Dedans, sur un lit de
mousse : une clé de cave en fer forgé, et une pile plate encore sous blister.`,
  indices: [
    `Une diode allumée vaut 1, une éteinte vaut 0. La carte a deux états : deux nombres,
mis bout à bout.`,
    `\`bits[i] - '0'\` transforme le caractère '1' en l'entier 1. C'est la conversion
qu'on oublie toujours en piscine.`,
    `n = n * 2 + (bits[i] - '0') à chaque tour. 00101010 fait 42, 01001010 fait 74 :
le tiroir porte le 4274.`,
  ],
};
