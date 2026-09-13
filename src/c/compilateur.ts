// Le guichet du compilateur, côté jeu : on lui donne du C, il rend un résultat.
// Tout le poids (58 Mo de WebAssembly) est de l'autre côté, dans le travailleur.
import type { Demande, Reponse, Resultat } from './protocole';

export type Progression = { etape: string; part: number };

type EnAttente = (resultat: Resultat) => void;

let travailleur: Worker | null = null;
let suivant = 1;
const enAttente = new Map<number, EnAttente>();
const abonnes = new Set<(p: Progression | null) => void>();

function obtenir(): Worker {
  if (travailleur) return travailleur;
  travailleur = new Worker(new URL('./travailleur.ts', import.meta.url), { type: 'module' });
  travailleur.onmessage = (evenement: MessageEvent<Reponse>) => {
    const reponse = evenement.data;
    if (reponse.type === 'progression') {
      abonnes.forEach((f) => f({ etape: reponse.etape, part: reponse.part }));
    } else if (reponse.type === 'pret') {
      abonnes.forEach((f) => f(null));
    } else {
      enAttente.get(reponse.id)?.(reponse.resultat);
      enAttente.delete(reponse.id);
    }
  };
  return travailleur;
}

/**
 * Met la chaîne en route sans rien compiler. Appelé dès l'écran titre : les 15 Mo
 * descendent pendant que le joueur lit le scénario, et la première compilation
 * ne se paie pas l'attente.
 */
export function prechauffer(): void {
  obtenir().postMessage({ type: 'preparer' } satisfies Demande);
}

export function surProgression(f: (p: Progression | null) => void): () => void {
  abonnes.add(f);
  return () => { abonnes.delete(f); };
}

export function compilerEtExecuter(source: string): Promise<Resultat> {
  const id = suivant++;
  return new Promise((resoudre) => {
    enAttente.set(id, resoudre);
    obtenir().postMessage({ type: 'executer', id, source } satisfies Demande);
  });
}

export type { Resultat };
