import { describe, expect, it } from 'vitest';
import { PIECES } from '../src/contenu';
import type { Exercice } from '../src/contenu/types';
import { verifierNorme } from '../src/moteur/norme';
import { empreinte } from '../src/moteur/verrous';
import { compilerEtExecuter } from './chaine';
import { SOLUTIONS } from './solutions';

const exercices: Array<[string, Exercice]> = PIECES.flatMap((piece) =>
  piece.objets.flatMap((objet) =>
    objet.exercice ? [[`${piece.nom} — ${objet.exercice.id}`, objet.exercice] as [string, Exercice]] : []),
);

describe('les énigmes de code sont réellement résolubles', () => {
  it.each(exercices)('%s', async (_intitule, exercice) => {
    const solution = SOLUTIONS[exercice.id];
    expect(solution, `pas de solution de référence pour ${exercice.id}`).toBeDefined();

    const source = exercice.harnais ? `${solution}\n\n${exercice.harnais}\n` : solution!;
    const resultat = await compilerEtExecuter(source);

    expect(resultat.diagnostics, `${exercice.id} : clang râle`).toBe('');
    expect(resultat.reussi, `${exercice.id} : le programme n'a pas fini proprement`).toBe(true);
    expect(resultat.sortie.trim()).toBe(exercice.attendu.trim());
  }, 120_000);

  it('le squelette fourni ne passe jamais du premier coup', async () => {
    // Un squelette qui donnerait déjà la bonne réponse viderait l'énigme de sa substance.
    for (const [, exercice] of exercices) {
      const source = exercice.harnais
        ? `${exercice.squelette}\n\n${exercice.harnais}\n`
        : exercice.squelette;
      const resultat = await compilerEtExecuter(source);
      const juste = resultat.reussi
        && resultat.sortie.trim() === exercice.attendu.trim()
        && (!exercice.norme || verifierNorme(exercice.squelette).length === 0);
      expect(juste, `${exercice.id} : le squelette résout déjà l'énigme`).toBe(false);
    }
  }, 300_000);
});

describe('la Norme', () => {
  it('rejette le squelette du testament et accepte sa solution', () => {
    const testament = exercices.find(([, e]) => e.norme)![1];
    expect(verifierNorme(testament.squelette).length).toBeGreaterThan(0);
    expect(verifierNorme(SOLUTIONS[testament.id]!)).toEqual([]);
  });

  it('voit les écarts les plus courants de la piscine', () => {
    const regles = verifierNorme([
      'int main(void) {',
      '    int i = 0;',
      '    for (i = 0; i < 3; i++)',
      '        printf("%d", i > 1 ? 1 : 0);',
      '}',
    ].join('\n')).map((ecart) => ecart.regle);

    expect(regles).toContain('BRACE_NEWLINE');
    expect(regles).toContain('CONTROL_STRUCT');
    expect(regles).toContain('TERNARY');
    expect(regles).toContain('SPACE_REPLACE_TAB');
  });
});

describe('les verrous', () => {
  it('chaque empreinte correspond à une réponse connue', async () => {
    const reponses: Record<string, string> = {
      bureau: '1489', bibliotheque: 'SEVERIN', chambre: 'NUL', atelier: '4274',
      cave: '1793', grenier: '5040', 'salle-serveur': '2142', testament: 'AUBE',
    };
    for (const piece of PIECES) {
      if (piece.verrou.type === 'objet') continue;
      const reponse = reponses[piece.id];
      expect(reponse, `pas de réponse connue pour ${piece.id}`).toBeDefined();
      expect(await empreinte(reponse!), piece.id).toBe(piece.verrou.empreinte);
    }
  });
});
