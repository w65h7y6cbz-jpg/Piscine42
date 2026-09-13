// Les solutions ne sont pas écrites en clair dans le paquet envoyé au navigateur :
// on n'en garde que l'empreinte. Ça n'arrêterait pas quelqu'un de déterminé — le jeu
// tourne entièrement côté client — mais ça évite de gâcher une énigme en ouvrant
// l'inspecteur par curiosité.
//
// Le jour où la progression passera par le serveur, c'est le Worker qui tranchera,
// et cette vérification-ci deviendra un simple confort d'affichage.

const SEL = 'villa-nul:';

export function normaliser(reponse: string): string {
  return reponse.trim().toUpperCase().replace(/\s+/g, '');
}

export async function empreinte(reponse: string): Promise<string> {
  const octets = new TextEncoder().encode(SEL + normaliser(reponse));
  const condensat = await crypto.subtle.digest('SHA-256', octets);
  return [...new Uint8Array(condensat)]
    .map((o) => o.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifier(reponse: string, attendue: string): Promise<boolean> {
  return (await empreinte(reponse)) === attendue;
}
