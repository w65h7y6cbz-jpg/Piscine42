import { useEffect, useState } from 'react';
import { enPendule, heureDeLaNuit } from '../moteur/horloge';
import { creditMs, restantMs, type Etat } from '../moteur/partie';

/** Le compte à rebours. Sous cinq minutes, il commence à battre. */
export function Pendule({ etat, surAube }: { etat: Etat; surAube: () => void }) {
  const [restant, setRestant] = useState(() => restantMs(etat));

  useEffect(() => {
    setRestant(restantMs(etat));
    if (etat.terminee) return;
    const battement = window.setInterval(() => {
      const reste = restantMs(etat);
      setRestant(reste);
      if (reste <= 0) surAube();
    }, 250);
    return () => window.clearInterval(battement);
  }, [etat, surAube]);

  return (
    <>
      <span className={`pendule${restant < 5 * 60_000 ? ' urgence' : ''}`}>
        {enPendule(restant)}
      </span>
      <span className="lieu" title="L’heure qu’il est dans la villa">
        il est {heureDeLaNuit(restant, creditMs(etat))}
      </span>
    </>
  );
}
