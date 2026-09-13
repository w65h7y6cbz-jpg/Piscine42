// La progression, écrite dans le navigateur.
//
// Une seule partie en cours à la fois, c'est le besoin d'aujourd'hui : Daniel joue seul,
// sur sa machine. Le jour où la reprise devra suivre d'un appareil à l'autre, c'est
// `lire`/`ecrire` qu'on branchera sur Supabase — le reste du jeu ne saura pas que
// quelque chose a changé.
import { VERSION_SAUVEGARDE, type Etat } from './partie';

const CLE = 'escape42:partie';

export function lire(): Etat | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const etat = JSON.parse(brut) as Etat;
    // Une sauvegarde d'une version antérieure vaut mieux jetée que mal relue.
    if (etat?.version !== VERSION_SAUVEGARDE) return null;
    return etat;
  } catch {
    return null;
  }
}

export function ecrire(etat: Etat): void {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
  } catch {
    // Navigation privée, quota plein : le jeu continue, sans filet.
  }
}

export function effacer(): void {
  try {
    localStorage.removeItem(CLE);
  } catch {
    // Rien à faire de plus.
  }
}
