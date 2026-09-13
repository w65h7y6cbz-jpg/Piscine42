// Un sous-ensemble de la Norme 42, vérifié dans le navigateur.
//
// La vraie norminette est un programme Python : rien à en tirer côté web. Ce qui suit
// couvre les règles qui coûtent le plus de points en piscine — celles qu'on se prend
// bêtement, pas les subtilités de mise en forme.

export type Ecart = { ligne: number; regle: string; message: string };

const MOTS_INTERDITS: Array<[RegExp, string, string]> = [
  [/\bfor\s*\(/, 'CONTROL_STRUCT', 'La boucle `for` est interdite par la Norme. Utilise `while`.'],
  [/\bdo\s*\{/, 'CONTROL_STRUCT', 'La boucle `do...while` est interdite par la Norme.'],
  [/\bswitch\s*\(/, 'CONTROL_STRUCT', '`switch` est interdit par la Norme.'],
  [/\bgoto\b/, 'CONTROL_STRUCT', '`goto` est interdit par la Norme.'],
];

const LARGEUR_MAX = 80;
const LIGNES_PAR_FONCTION = 25;
const FONCTIONS_PAR_FICHIER = 5;
const PARAMETRES_MAX = 4;

/** Une largeur de tabulation de 4, comme la norminette. */
function largeurAffichee(ligne: string): number {
  let largeur = 0;
  for (const caractere of ligne) largeur += caractere === '\t' ? 4 - (largeur % 4) : 1;
  return largeur;
}

const enTeteDeFonction = /^[A-Za-z_][\w\s*]*\b([a-z_]\w*)\s*\(([^)]*)\)\s*$/;
/** Le même en-tête, mais suivi de son accolade sur la même ligne : la Norme l'interdit. */
const enTeteAccolee = /^[A-Za-z_][\w\s*]*\b[a-z_]\w*\s*\([^)]*\)\s*\{/;

export function verifierNorme(source: string): Ecart[] {
  const ecarts: Ecart[] = [];
  const lignes = source.split('\n');

  let fonctions = 0;
  let debutCorps: number | null = null;
  let profondeur = 0;
  let dansCommentaire = false;

  lignes.forEach((ligne, index) => {
    const numero = index + 1;

    // On ne juge ni les commentaires ni les chaînes sur le contenu, seulement sur la forme.
    if (dansCommentaire) {
      if (ligne.includes('*/')) dansCommentaire = false;
      return;
    }
    if (ligne.includes('/*') && !ligne.includes('*/')) dansCommentaire = true;

    if (largeurAffichee(ligne) > LARGEUR_MAX) {
      ecarts.push({ ligne: numero, regle: 'TOO_MANY_COLS',
        message: `Ligne de ${largeurAffichee(ligne)} colonnes, le maximum est ${LARGEUR_MAX}.` });
    }
    if (/^ +/.test(ligne)) {
      ecarts.push({ ligne: numero, regle: 'SPACE_REPLACE_TAB',
        message: 'Indentation à l’espace : la Norme veut des tabulations.' });
    }
    if (/[ \t]+$/.test(ligne)) {
      ecarts.push({ ligne: numero, regle: 'SPC_BEFORE_NL',
        message: 'Espace ou tabulation en fin de ligne.' });
    }
    if (/\?[^:]*:/.test(ligne) && !ligne.includes('//')) {
      ecarts.push({ ligne: numero, regle: 'TERNARY',
        message: 'L’opérateur ternaire est interdit par la Norme.' });
    }
    for (const [motif, regle, message] of MOTS_INTERDITS) {
      if (motif.test(ligne)) ecarts.push({ ligne: numero, regle, message });
    }

    if (enTeteAccolee.test(ligne.trim())) {
      ecarts.push({ ligne: numero, regle: 'BRACE_NEWLINE',
        message: 'L’accolade ouvrante d’une fonction va seule sur la ligne suivante.' });
    }

    const enTete = enTeteDeFonction.exec(ligne.trim());
    if (enTete && lignes[index + 1]?.trim() === '{') {
      fonctions++;
      const parametres = enTete[2]!.trim();
      const nombre = parametres === '' || parametres === 'void'
        ? 0 : parametres.split(',').length;
      if (nombre > PARAMETRES_MAX) {
        ecarts.push({ ligne: numero, regle: 'TOO_MANY_ARGS',
          message: `${nombre} paramètres, le maximum est ${PARAMETRES_MAX}.` });
      }
      debutCorps = numero + 1;
      profondeur = 0;
    }

    if (debutCorps !== null) {
      profondeur += (ligne.match(/\{/g) ?? []).length;
      profondeur -= (ligne.match(/\}/g) ?? []).length;
      if (profondeur === 0 && numero > debutCorps) {
        const corps = numero - debutCorps - 1;
        if (corps > LIGNES_PAR_FONCTION) {
          ecarts.push({ ligne: debutCorps, regle: 'TOO_MANY_LINES',
            message: `Fonction de ${corps} lignes, le maximum est ${LIGNES_PAR_FONCTION}.` });
        }
        debutCorps = null;
      }
    }
  });

  if (fonctions > FONCTIONS_PAR_FICHIER) {
    ecarts.push({ ligne: 1, regle: 'TOO_MANY_FUNCS',
      message: `${fonctions} fonctions dans le fichier, le maximum est ${FONCTIONS_PAR_FICHIER}.` });
  }
  return ecarts.sort((a, b) => a.ligne - b.ligne);
}
