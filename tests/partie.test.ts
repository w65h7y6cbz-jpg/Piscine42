import { describe, expect, it } from 'vitest';
import { PIECES } from '../src/contenu';
import {
  COUT_INDICE_MINUTES, creditMs, deplierIndice, franchir, nouvellePartie,
  rattraperParLAube, restantMs,
} from '../src/moteur/partie';

const DEBUT = Date.parse('2026-09-13T13:00:00Z'); // minuit passé à Nouméa

describe('la progression', () => {
  it('commence dans le hall, et le hall seul', () => {
    const etat = nouvellePartie(DEBUT);
    expect(etat.pieceCourante).toBe('hall');
    expect(etat.piecesOuvertes).toEqual(['hall']);
    expect(etat.terminee).toBeNull();
  });

  it('ouvre la pièce suivante et y emmène le joueur', () => {
    const etat = franchir(nouvellePartie(DEBUT), 'hall');
    expect(etat.piecesResolues).toEqual(['hall']);
    expect(etat.pieceCourante).toBe('bureau');
    expect(etat.piecesOuvertes).toEqual(['hall', 'bureau']);
  });

  it('franchir la dernière pièce, c’est sortir', () => {
    const etat = PIECES.reduce((avant, piece) => franchir(avant, piece.id), nouvellePartie(DEBUT));
    expect(etat.terminee).toBe('evasion');
    expect(etat.piecesResolues).toHaveLength(PIECES.length);
  });
});

describe('la nuit', () => {
  it('ne crédite que le temps des pièces ouvertes', () => {
    const etat = nouvellePartie(DEBUT);
    expect(creditMs(etat)).toBe(PIECES[0]!.minutes * 60_000);
    expect(creditMs(franchir(etat, 'hall'))).toBe((PIECES[0]!.minutes + PIECES[1]!.minutes) * 60_000);
  });

  it('un indice coûte des minutes, et les indices s’épuisent', () => {
    let etat = nouvellePartie(DEBUT);
    etat = deplierIndice(etat, 'hall');
    expect(etat.penaliteMs).toBe(COUT_INDICE_MINUTES * 60_000);
    expect(etat.indicesOuverts['hall']).toBe(1);

    const nombre = PIECES[0]!.indices.length;
    for (let i = 1; i <= nombre + 3; i++) etat = deplierIndice(etat, 'hall');
    expect(etat.indicesOuverts['hall']).toBe(nombre);
    expect(etat.penaliteMs).toBe(nombre * COUT_INDICE_MINUTES * 60_000);
  });

  it('le compte à rebours ne passe jamais sous zéro', () => {
    const etat = nouvellePartie(DEBUT);
    expect(restantMs(etat, DEBUT)).toBe(PIECES[0]!.minutes * 60_000);
    expect(restantMs(etat, DEBUT + 999 * 60_000)).toBe(0);
  });

  it('une partie finie fige l’horloge', () => {
    const etat = rattraperParLAube(nouvellePartie(DEBUT));
    expect(etat.terminee).toBe('aube');
    expect(restantMs(etat, DEBUT + 10_000_000)).toBe(restantMs(etat, DEBUT + 20_000_000));
  });
});
