export interface Defi {
  id: string;
  numero: number;
  titre: string;
  description: string;
  indice: string;
  reponseHash: string; // SHA-256 de la réponse
  difficulte: 'facile' | 'moyen' | 'difficile';
}

// Réponses en clair (à hacher en SHA-256 lors de la génération)
// Les défis progressent du simple au complexe
export const DEFIS_CTF: Defi[] = [
  {
    id: 'ctf-1-html',
    numero: 1,
    titre: 'Les bases du web',
    description: `Séverin était fasciné par les origines du web. Inspect le code source de cette page
      (Ctrl+Maj+I → Onglet "Elements") et trouve la balise HTML cachée qui contient un message secret.

      Quel est le contenu de la balise <secrets> ?`,
    indice: 'Regarde dans le <head> de la page. C\'est une balise que le navigateur cache par défaut.',
    reponseHash: 'ad8b3c962d542d298404a99656374336a1c43687dff23eefe6d13879a0fbcc06', // "42ecole"
    difficulte: 'facile',
  },
  {
    id: 'ctf-2-binaire',
    numero: 2,
    titre: 'Le langage des machines',
    description: `La Norme 42 impose une règle mystérieuse. Convertis ce nombre binaire en décimal :

      101010

      (Astuce: c'est aussi le nombre magique de Douglas Adams)`,
    indice: 'Chaque bit vaut 2^position. De droite à gauche: 0, 2, 4, 8, 16, 32...',
    reponseHash: '73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049', // "42"
    difficulte: 'facile',
  },
  {
    id: 'ctf-3-base64',
    numero: 3,
    titre: 'Chiffrer c\'est communiquer',
    description: `Un message a été encodé en base64 par Séverin. Décode-le :

      UHJvZ3JhbW1hdGlvbg==

      Cherche ensuite sur Wikipedia le mot qui correspond.
      Quel est le siège de Wikipedia ?`,
    indice: 'Base64 online decoder → Puis cherche "Programmation" sur Wikipedia',
    reponseHash: 'bf11ba3f487c384138273c1715b1b4630260bda6d9074fc398bae619aaaf561d', // "wikipedia"
    difficulte: 'moyen',
  },
  {
    id: 'ctf-4-chmod',
    numero: 4,
    titre: 'Les permissions Unix',
    description: `Dans un terminal Unix, comment donner à un fichier les permissions "rwxr-xr-x" ?

      Réponds avec la commande chmod (ex: chmod 755 file.txt)
      Mais donne juste le nombre octal (755) sans "chmod" ni "file.txt".`,
    indice: 'r=4, w=2, x=1. rwx = 7. r-x = 5. r-x = 5',
    reponseHash: '86ab8cbe5869bd1f9c70924e9c04fef3bbe3bbaaf4e816efeeaf7eb6a31937d2', // "755"
    difficulte: 'moyen',
  },
  {
    id: 'ctf-5-grep',
    numero: 5,
    titre: 'Chercher dans le code',
    description: `Imagine un fichier texte avec 1000 lignes. Quelle commande Unix te permet de trouver
      toutes les lignes contenant le mot "fonction" ?

      Réponds juste avec le nom de la commande (ex: cat, find, grep, ls...)`,
    indice: 'La commande qui cherche dans des fichiers texte s\'appelle... grep!',
    reponseHash: 'faefbbbf05cb9cfb18112dde743b3eb327b5b26426f4206583a2fb4cb9cc344d', // "grep"
    difficulte: 'facile',
  },
  {
    id: 'ctf-6-histoire',
    numero: 6,
    titre: 'L\'histoire de l\'école',
    description: `L\'École 42 a été fondée par Xavier Niel. En quelle année ?

      (Cherche sur Google ou sur le site officiel de 42)`,
    indice: 'Visite https://42.fr ou cherche "42 école fondée"',
    reponseHash: '7931aa2a1bed855457d1ddf6bc06ab4406a9fba0579045a4d6ff78f9c07c440f', // "2013"
    difficulte: 'facile',
  },
];

// Fonction pour hacher une réponse en SHA-256 (pour tests)
export async function hasherReponse(texte: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(texte.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function verifierReponse(reponse: string, hash: string): boolean {
  // Comparaison simple du hash
  return reponse.toLowerCase().trim() === hash.toLowerCase().trim();
}
