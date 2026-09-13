/**
 * Le C de la piscine s'indente à la tabulation — la Norme est formelle. Mais écrire
 * des `\t` au milieu d'un fichier TypeScript le rend illisible, alors on écrit les
 * extraits avec quatre espaces et on convertit ici.
 *
 * On lit les morceaux **bruts** et non interprétés : sans ça, le `\n` d'un
 * `printf("...\n")` deviendrait un vrai retour à la ligne au milieu d'une chaîne C,
 * et le code ne compilerait plus. Même chose pour le `'\0'` terminal.
 *
 * Usage : c`...`
 */
export function c(morceaux: TemplateStringsArray, ...valeurs: unknown[]): string {
  const brut = morceaux.raw.reduce(
    (acc, morceau, index) => acc + morceau + (index < valeurs.length ? String(valeurs[index]) : ''),
    '',
  );

  const lignes = brut.replace(/^\n/, '').replace(/\n[ ]*$/, '\n').split('\n');

  // On retire l'indentation commune, celle qui ne vient que de la mise en page du
  // fichier TypeScript, avant de traduire ce qui reste en tabulations.
  const marges = lignes
    .filter((ligne) => ligne.trim() !== '')
    .map((ligne) => (/^ */.exec(ligne))![0].length);
  const marge = marges.length ? Math.min(...marges) : 0;

  return lignes
    .map((ligne) => {
      const sansMarge = ligne.slice(marge);
      const espaces = (/^ */.exec(sansMarge))![0].length;
      return '\t'.repeat(Math.floor(espaces / 4)) + sansMarge.slice(espaces);
    })
    .join('\n');
}
