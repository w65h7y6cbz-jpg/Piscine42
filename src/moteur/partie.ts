// L'état d'une évasion, et les seules façons de le faire bouger.
//
// Tout tient dans un objet sérialisable : c'est lui qu'on écrit dans le navigateur
// aujourd'hui, et c'est lui qui partira dans Supabase le jour où la progression suivra
// le joueur d'une machine à l'autre.
import { PIECES, pieceParId } from '../contenu';

export const VERSION_SAUVEGARDE = 1;

/** Ce que coûte un indice, en minutes retirées à la nuit. */
export const COUT_INDICE_MINUTES = 2;

export type Fin = 'evasion' | 'aube';

export type Etat = {
  version: number;
  commenceeA: number;
  pieceCourante: string;
  piecesOuvertes: string[];
  piecesResolues: string[];
  /** Les objets déjà fouillés, sous la forme `piece:objet`. */
  examines: string[];
  exercicesResolus: string[];
  inventaire: string[];
  /** Combien d'indices ont été dépliés dans chaque pièce. */
  indicesOuverts: Record<string, number>;
  penaliteMs: number;
  /** Le dernier code écrit pour chaque exercice, pour ne rien reperdre en sortant. */
  brouillons: Record<string, string>;
  terminee: Fin | null;
  termineeA: number | null;
};

export function nouvellePartie(maintenant: number = Date.now()): Etat {
  return {
    version: VERSION_SAUVEGARDE,
    commenceeA: maintenant,
    pieceCourante: PIECES[0]!.id,
    piecesOuvertes: [PIECES[0]!.id],
    piecesResolues: [],
    examines: [],
    exercicesResolus: [],
    inventaire: [],
    indicesOuverts: {},
    penaliteMs: 0,
    brouillons: {},
    terminee: null,
    termineeA: null,
  };
}

/** Le temps crédité : chaque pièce ouverte ajoute sa dotation à la nuit. */
export function creditMs(etat: Etat): number {
  return etat.piecesOuvertes.reduce(
    (total, id) => total + (pieceParId(id)?.minutes ?? 0) * 60_000, 0);
}

export function restantMs(etat: Etat, maintenant: number = Date.now()): number {
  if (etat.terminee) {
    return Math.max(0, creditMs(etat) - etat.penaliteMs - ((etat.termineeA ?? maintenant) - etat.commenceeA));
  }
  return Math.max(0, creditMs(etat) - etat.penaliteMs - (maintenant - etat.commenceeA));
}

const ajouter = (liste: string[], ...valeurs: string[]) =>
  [...new Set([...liste, ...valeurs])];

export const aExamine = (etat: Etat, pieceId: string, objetId: string) =>
  etat.examines.includes(`${pieceId}:${objetId}`);

export const aResolu = (etat: Etat, exerciceId: string) =>
  etat.exercicesResolus.includes(exerciceId);

export function examiner(etat: Etat, pieceId: string, objetId: string, donne: string[] = []): Etat {
  return {
    ...etat,
    examines: ajouter(etat.examines, `${pieceId}:${objetId}`),
    inventaire: ajouter(etat.inventaire, ...donne),
  };
}

export function resoudreExercice(etat: Etat, exerciceId: string): Etat {
  return { ...etat, exercicesResolus: ajouter(etat.exercicesResolus, exerciceId) };
}

export function noterBrouillon(etat: Etat, exerciceId: string, code: string): Etat {
  return { ...etat, brouillons: { ...etat.brouillons, [exerciceId]: code } };
}

export function deplierIndice(etat: Etat, pieceId: string): Etat {
  const piece = pieceParId(pieceId);
  const deja = etat.indicesOuverts[pieceId] ?? 0;
  if (!piece || deja >= piece.indices.length) return etat;
  return {
    ...etat,
    indicesOuverts: { ...etat.indicesOuverts, [pieceId]: deja + 1 },
    penaliteMs: etat.penaliteMs + COUT_INDICE_MINUTES * 60_000,
  };
}

/** Le verrou a cédé : on marque la pièce et on ouvre la suivante. */
export function franchir(etat: Etat, pieceId: string): Etat {
  const index = PIECES.findIndex((piece) => piece.id === pieceId);
  const suivante = PIECES[index + 1];
  const resolues = ajouter(etat.piecesResolues, pieceId);

  if (!suivante) {
    return { ...etat, piecesResolues: resolues, terminee: 'evasion', termineeA: Date.now() };
  }
  return {
    ...etat,
    piecesResolues: resolues,
    piecesOuvertes: ajouter(etat.piecesOuvertes, suivante.id),
    pieceCourante: suivante.id,
  };
}

export function allerA(etat: Etat, pieceId: string): Etat {
  return etat.piecesOuvertes.includes(pieceId) ? { ...etat, pieceCourante: pieceId } : etat;
}

export function rattraperParLAube(etat: Etat): Etat {
  return etat.terminee ? etat : { ...etat, terminee: 'aube', termineeA: Date.now() };
}
