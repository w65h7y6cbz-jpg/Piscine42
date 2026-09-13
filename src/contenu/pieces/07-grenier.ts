import type { Piece } from '../types';
import { c } from '../c';

export const grenier: Piece = {
  id: 'grenier',
  numero: 7,
  nom: 'Le Grenier',
  notion: 'Récursivité — une fonction qui s’appelle',
  minutes: 18,
  fond: '/pieces/07-grenier/fond.webp',
  arrivee: `Sous les combles, la poussière tient dans l'air comme de la fumée. Une
lucarne laisse entrer une lumière grise — l'aube n'est plus si loin.

Des malles empilées, un mannequin de couturière, et sur le manteau de la cheminée un
cadre : un arbre généalogique aux cases toutes vides.`,
  objets: [
    {
      id: 'poupees',
      nom: 'Les poupées gigognes',
      zone: { x: 54, y: 62, l: 26, h: 16 },
      examen: `Sept poupées de bois clair, ouvertes et alignées sur une latte du
plancher, de la plus grande à la plus petite. Aucune décoration, juste des anneaux
gravés.

Dans la dernière, celle qui ne s'ouvre pas, quelque chose fait du bruit quand on la
secoue.`,
      zoom: '/pieces/07-grenier/zoom-poupees.webp',
    },
    {
      id: 'cadre',
      nom: "L'arbre généalogique",
      zone: { x: 14, y: 24, l: 20, h: 24 },
      examen: `Sept générations, dessinées à la main. Toutes les cases sont vides — pas
un nom, pas une date. Sous le dessin, une seule ligne au crayon :

  « Chacun contient tous ceux d'avant. C'est ça, une famille. »`,
    },
    {
      id: 'malle',
      nom: 'La grande malle',
      zone: { x: 62, y: 34, l: 24, h: 24 },
      examen: `Une malle de voyage à coins de laiton. Le loquet est fermé par un cadenas
à quatre chiffres.`,
    },
    {
      id: 'boite-a-musique',
      nom: 'La boîte à musique',
      zone: { x: 30, y: 58, l: 14, h: 12 },
      examen: `Le couvercle ouvert laisse voir le cylindre et son peigne de laiton. Elle
ne joue pas de musique : sous le mécanisme, un écran et un clavier minuscule.`,
      exercice: {
        id: 'grenier-recursion',
        notion: 'Récursivité, cas de base, accumulation',
        invite: 'COMBIEN DE FAÇONS DE RANGER SEPT POUPÉES ?',
        consigne: `Écris **ft_factorielle**, qui rend le produit de tous les entiers de
1 à n — et qui s'appelle elle-même.

\`\`\`c
int	ft_factorielle(int n);
\`\`\`

Une fonction récursive, c'est deux choses, jamais une de plus :

1. **Le cas de base** — la question si simple qu'on répond sans réfléchir. Ici :
   factorielle de 0, ou de 1, vaut 1.
2. **L'appel qui rapproche du cas de base** — \`n * ft_factorielle(n - 1)\`.

Oublie le premier et tu descends jusqu'à écraser la pile. C'est le \`Segmentation
fault\` le plus classique de la piscine, et la machine te le dira sans ménagement.

La boîte veut savoir de combien de façons on peut ordonner sept poupées.`,
        squelette: c`
          int	ft_factorielle(int n)
          {
              /* D'abord le cas de base. Toujours d'abord le cas de base. */
              return (0);
          }
        `,
        harnais: c`
          #include <stdio.h>

          int	main(void)
          {
              printf("%d\n", ft_factorielle(7));
              return (0);
          }
        `,
        attendu: '5040',
      },
    },
  ],
  verrou: {
    type: 'code',
    longueur: 4,
    empreinte: '8c3309e46a484f46b622d97d982e6779ae322bd679e467a7a2c51ed78df5b153',
    intitule: 'Le cadenas de la malle',
  },
  sortie: `La malle s'ouvre sur des câbles réseau soigneusement lovés, un onduleur, et
une porte découpée dans la paroi du fond — derrière la malle, pas derrière le mur. Il
avait aménagé un passage.`,
  indices: [
    `Sept poupées, et une phrase qui dit que chacune contient toutes les précédentes.
C'est la définition d'une fonction récursive, écrite en bois.`,
    `Sans cas de base, la fonction s'appelle sans fin et le programme meurt. Commence
par : si n vaut 0 ou 1, rends 1.`,
    `if (n <= 1) return (1) ; puis return (n * ft_factorielle(n - 1)) ;
Sept poupées font 5040.`,
  ],
};
