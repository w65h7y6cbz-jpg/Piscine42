// L'horloge de la villa.
//
// Le porteur du projet est en Nouvelle-Calédonie — Pacific/Noumea, UTC+11, sans heure
// d'été. Un serveur tourne en UTC, et onze heures sur vingt-quatre la date locale est
// celle du lendemain. Toute date montrée à quelqu'un passe donc par `dateLocale`, jamais
// par `toISOString().slice(0, 10)`.

export const FUSEAU = 'Pacific/Noumea';

/** La date du jour telle que la voit le joueur, pas telle que la voit le processus. */
export function dateLocale(instant: number = Date.now()): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(instant);
}

export function heureLocale(instant: number = Date.now()): string {
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU, hour: '2-digit', minute: '2-digit',
  }).format(instant);
}

/** Un compte à rebours en mm:ss, ou hh:mm:ss au-delà de l'heure. */
export function enPendule(millisecondes: number): string {
  const total = Math.max(0, Math.floor(millisecondes / 1000));
  const heures = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secondes = total % 60;
  const deux = (n: number) => String(n).padStart(2, '0');
  return heures > 0 ? `${heures}:${deux(minutes)}:${deux(secondes)}` : `${deux(minutes)}:${deux(secondes)}`;
}

/**
 * L'heure de la nuit affichée en haut de l'écran : la villa se ferme à minuit et le
 * jour se lève à 6 h. On projette le temps restant sur ces six heures-là.
 */
export function heureDeLaNuit(restantMs: number, totalMs: number): string {
  const part = totalMs === 0 ? 0 : 1 - Math.max(0, Math.min(1, restantMs / totalMs));
  const minutes = Math.round(part * 6 * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')} h ${String(minutes % 60).padStart(2, '0')}`;
}
