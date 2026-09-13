// Le vocabulaire du jeu. Tout le contenu des pièces s'écrit avec ces formes-là,
// et rien d'autre : le moteur ne connaît que ça.

/** Une zone cliquable du décor, en pourcentage de l'image pour rester responsive. */
export type Zone = { x: number; y: number; l: number; h: number };

/** Un exercice de code : le joueur écrit une fonction, un harnais la met à l'épreuve. */
export type Exercice = {
  id: string;
  notion: string;
  consigne: string;
  /** Le code déjà en place quand le joueur arrive. */
  squelette: string;
  /**
   * Le `main` de test, compilé avec le code du joueur. Il n'est jamais affiché tel
   * quel : le joueur voit ce que la machine attend, pas comment elle s'y prend.
   */
  harnais: string;
  /** La sortie exacte attendue, à l'espace près une fois les bords rognés. */
  attendu: string;
  /** Ce que la machine affiche avant toute tentative. */
  invite: string;
  /** Si vrai, la Norme est vérifiée en plus de l'exécution. */
  norme?: boolean;
};

export type Objet = {
  id: string;
  nom: string;
  zone: Zone;
  /** Le texte d'examen, à la première personne du joueur. */
  examen: string;
  /** L'image de zoom, si l'objet en a une. */
  zoom?: string;
  /** L'objet est une machine : cliquer dessus ouvre l'éditeur de C. */
  exercice?: Exercice;
  /** Ce que l'objet verse à l'inventaire une fois examiné (ou l'exercice résolu). */
  donne?: string[];
  /** Objet d'inventaire nécessaire pour en tirer quoi que ce soit. */
  requiert?: string;
  /** Le refus, quand `requiert` n'est pas satisfait. */
  refus?: string;
  /** L'objet n'apparaît qu'une fois cet exercice résolu. */
  apparaitApres?: string;
  /** L'objet est un terminal Unix : cliquer dessus ouvre un shell. */
  terminal?: Terminal;
};

export type Verrou =
  | { type: 'code'; longueur: number; empreinte: string; intitule: string }
  | { type: 'lettres'; longueur: number; empreinte: string; intitule: string }
  | { type: 'objet'; objet: string; intitule: string };

export type Piece = {
  id: string;
  numero: number;
  nom: string;
  notion: string;
  /** Le texte d'ambiance à l'entrée. */
  arrivee: string;
  fond: string;
  /** Minutes créditées à l'horloge en entrant. */
  minutes: number;
  objets: Objet[];
  verrou: Verrou;
  /** Ce qu'on lit quand le verrou cède. */
  sortie: string;
  /** Les indices, du plus discret au plus explicite. Chacun coûte des minutes. */
  indices: string[];
};

export type ObjetInventaire = { id: string; nom: string; image: string; description: string };

/** Le terminal de la salle serveur : un Unix de poche, en mémoire. */
export type Terminal = {
  id: string;
  accueil: string;
  /** chemin absolu → contenu du fichier. Un dossier est une entrée sans contenu. */
  fichiers: Record<string, string | null>;
  /** Les chemins qu'un `cat` refuse tant qu'on n'a pas fait `chmod +r`. */
  interdits: string[];
  /** Le faux journal git, du plus récent au plus ancien. */
  journalGit: Array<{ empreinte: string; message: string }>;
};
