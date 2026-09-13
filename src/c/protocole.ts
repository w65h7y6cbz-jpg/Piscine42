// Ce qui circule entre le jeu et le fil d'exécution qui porte le compilateur.

export type Demande =
  | { type: 'preparer' }
  | { type: 'executer'; id: number; source: string };

export type Reponse =
  | { type: 'progression'; etape: string; part: number }
  | { type: 'pret' }
  | { type: 'resultat'; id: number; resultat: Resultat };

/** Ce que le joueur voit après avoir appuyé sur « Compiler ». */
export type Resultat = {
  /** `true` seulement si la compilation, l'édition de liens et l'exécution ont abouti. */
  reussi: boolean;
  /** Ce que le programme a écrit sur la sortie standard. */
  sortie: string;
  /** Les diagnostics de clang, débarrassés de leurs codes couleur. */
  diagnostics: string;
  /** Le code de retour du programme, ou null s'il n'est jamais parti. */
  code: number | null;
  duree: { compilation: number; liaison: number; execution: number };
};
