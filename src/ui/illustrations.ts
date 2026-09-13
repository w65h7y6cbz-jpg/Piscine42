// Mapping des images WebP aux pièces et objets du jeu.
// Les numéros correspondent aux fichiers dans public/pieces/NN-*.webp

export const illustrations = {
  // Hall
  'hall-fond': '/pieces/01-villa-nuit.webp',
  'hall-interphone': '/pieces/03-objet-interphone.webp',
  'hall-boite': '/pieces/04-objet-boite-aux-lettres.webp',
  'hall-tableau': '/pieces/05-objet-tableau-electrique.webp',
  'hall-etagere': '/pieces/10-zoom-etagere.webp',
  'hall-paillasson': '/pieces/11-zoom-paillasson.webp',

  // Bureau
  'bureau-fond': '/pieces/02-fond.webp',
  'bureau-miroir': '/pieces/18-objet-miroir.webp',
  'bureau-coffret': '/pieces/19-objet-coffret.webp',
  'bureau-lettres': '/pieces/20-objet-lettres.webp',
  'bureau-tiroir': '/pieces/21-zoom-tiroir.webp',

  // Bibliothèque
  'bibli-fond': '/pieces/06-fond.webp',
  'bibli-loupe': '/pieces/13-objet-loupe.webp',
  'bibli-lampe': '/pieces/14-objet-lampe-uv.webp',
  'bibli-carnet': '/pieces/15-objet-carnet.webp',
  'bibli-mur-uv': '/pieces/16-zoom-mur-uv.webp',

  // Chambre
  'chambre-fond': '/pieces/12-fond.webp',
  'chambre-fer-a-souder': '/pieces/23-objet-fer-a-souder.webp',
  'chambre-casier': '/pieces/24-objet-casier.webp',
  'chambre-plan': '/pieces/25-objet-plan.webp',
  'chambre-circuit': '/pieces/26-zoom-circuit.webp',

  // Atelier
  'atelier-fond': '/pieces/22-fond.webp',
  'atelier-carton': '/pieces/28-objet-carton.webp',
  'atelier-registre': '/pieces/29-objet-registre.webp',
  'atelier-vanne': '/pieces/30-objet-vanne.webp',
  'atelier-compteur': '/pieces/31-zoom-compteur-eau.webp',

  // Cave
  'cave-fond': '/pieces/27-fond.webp',
  'cave-malle': '/pieces/33-objet-malle.webp',
  'cave-boite-musique': '/pieces/34-objet-boite-a-musique.webp',
  'cave-genealogie': '/pieces/35-objet-cadre-genealogie.webp',
  'cave-poupees': '/pieces/36-zoom-poupees.webp',

  // Grenier
  'grenier-fond': '/pieces/32-fond.webp',
  'grenier-terminal': '/pieces/38-objet-terminal.webp',
  'grenier-bandes': '/pieces/39-objet-bandes.webp',
  'grenier-brassage': '/pieces/40-objet-brassage.webp',
  'grenier-cables': '/pieces/41-zoom-cables.webp',

  // Salle Serveur
  'serveur-fond': '/pieces/37-fond.webp',
  'serveur-porte': '/pieces/43-objet-porte.webp',
  'serveur-machine': '/pieces/44-objet-machine-notaire.webp',
  'serveur-enveloppe': '/pieces/45-objet-enveloppe.webp',
  'serveur-serrure': '/pieces/46-zoom-serrure.webp',

  // Testament
  'testament-fond': '/pieces/42-fond.webp',
  'testament-cle-laiton': '/pieces/47-cle-laiton.webp',
  'testament-cle-cave': '/pieces/48-cle-cave.webp',
  'testament-carte-perforee': '/pieces/49-carte-perforee.webp',
  'testament-disquette': '/pieces/50-disquette.webp',

  // Écrans finaux
  'evasion': '/pieces/51-evasion.webp',
  'echec': '/pieces/52-echec.webp',
};

export function img(cle: string): string {
  return illustrations[cle as keyof typeof illustrations] || '/pieces/02-fond.webp';
}
