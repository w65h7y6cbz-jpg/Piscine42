import type { ObjetInventaire, Piece } from './types';
import { hall } from './pieces/01-hall';
import { bureau } from './pieces/02-bureau';
import { bibliotheque } from './pieces/03-bibliotheque';
import { chambre } from './pieces/04-chambre';
import { atelier } from './pieces/05-atelier';
import { cave } from './pieces/06-cave';
import { grenier } from './pieces/07-grenier';
import { salleServeur } from './pieces/08-salle-serveur';
import { testament } from './pieces/09-testament';

/** L'ordre de la liste est l'ordre de l'évasion. */
export const PIECES: Piece[] = [
  hall, bureau, bibliotheque, chambre, atelier, cave, grenier, salleServeur, testament,
];

export const pieceParId = (id: string): Piece | undefined =>
  PIECES.find((piece) => piece.id === id);

export const INVENTAIRE: Record<string, ObjetInventaire> = {
  'cle-laiton': {
    id: 'cle-laiton', nom: 'Clé en laiton', image: '/inventaire/cle-laiton.webp',
    description: "Terne, l'anneau ouvragé. Trouvée sous le paillasson du hall.",
  },
  'carte-perforee': {
    id: 'carte-perforee', nom: 'Carte perforée', image: '/inventaire/carte-perforee.webp',
    description: 'Beige, un coin coupé en biais. Des trous, et aucune machine pour la lire.',
  },
  'loupe': {
    id: 'loupe', nom: 'Loupe', image: '/inventaire/loupe.webp',
    description: 'Monture de laiton, lentille rayée. Agrandit ce qui est petit.',
  },
  'lampe-uv': {
    id: 'lampe-uv', nom: 'Lampe à ultraviolets', image: '/inventaire/lampe-uv.webp',
    description: 'Montre ce qui a été écrit pour ne pas être vu.',
  },
  'cle-plate': {
    id: 'cle-plate', nom: 'Petite clé plate', image: '/inventaire/cle-plate.webp',
    description: 'Fine, en laiton. Pour une serrure minuscule.',
  },
  'plan-villa': {
    id: 'plan-villa', nom: 'Plan de la villa', image: '/inventaire/plan-villa.webp',
    description: 'Un bleu technique. Il montre une pièce sous la cave.',
  },
  'cle-cave': {
    id: 'cle-cave', nom: 'Clé de cave', image: '/inventaire/cle-cave.webp',
    description: 'Fer forgé, lourde, rouillée.',
  },
  'enveloppe-scellee': {
    id: 'enveloppe-scellee', nom: 'Enveloppe cachetée', image: '/inventaire/enveloppe-scellee.webp',
    description: 'Cire rouge, une spirale frappée dedans. Elle ne s’ouvrira qu’au bout.',
  },
};
