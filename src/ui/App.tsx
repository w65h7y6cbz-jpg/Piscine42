import { useCallback, useEffect, useState } from 'react';
import { PIECES, pieceParId } from '../contenu';
import type { Objet } from '../contenu/types';
import {
  allerA, deplierIndice, examiner, franchir, noterBrouillon, nouvellePartie,
  rattraperParLAube, resoudreExercice, type Etat,
} from '../moteur/partie';
import * as sauvegarde from '../moteur/sauvegarde';
import { EcranTitre } from './EcranTitre';
import { Scene } from './Scene';
import { Pendule } from './Pendule';
import { AtelierC } from './AtelierC';
import { TerminalUnix } from './TerminalUnix';
import { Fin } from './Fin';

export function App() {
  const [etat, setEtat] = useState<Etat | null>(null);
  const [sauvee] = useState(() => sauvegarde.lire());
  const [machine, setMachine] = useState<Objet | null>(null);

  // Toute avancée est écrite immédiatement : une partie perdue parce qu'on a fermé
  // l'onglet est une partie que personne ne recommence.
  useEffect(() => { if (etat) sauvegarde.ecrire(etat); }, [etat]);

  const surAube = useCallback(() => {
    setEtat((avant) => (avant ? rattraperParLAube(avant) : avant));
  }, []);

  if (!etat) {
    return (
      <EcranTitre
        aUneSauvegarde={sauvee !== null && sauvee.terminee === null}
        surDebut={() => { sauvegarde.effacer(); setEtat(nouvellePartie()); }}
        surReprise={() => { if (sauvee) setEtat(sauvee); }}
      />
    );
  }

  if (etat.terminee) {
    return <Fin etat={etat} surRecommencer={() => { sauvegarde.effacer(); setEtat(null); }} />;
  }

  const piece = pieceParId(etat.pieceCourante);
  if (!piece) return null;

  return (
    <>
      <header className="bandeau">
        <Pendule etat={etat} surAube={surAube} />
        <span className="lieu">
          Pièce {piece.numero} sur {PIECES.length} — {piece.nom}
        </span>
        <div className="droite">
          {PIECES.filter((p) => etat.piecesOuvertes.includes(p.id)).map((p) => (
            <button
              key={p.id}
              onClick={() => setEtat(allerA(etat, p.id))}
              disabled={p.id === etat.pieceCourante}
              title={p.nom}
              style={{ padding: '0.3rem 0.6rem' }}
            >
              {p.numero}
            </button>
          ))}
        </div>
      </header>

      <Scene
        piece={piece}
        etat={etat}
        surExamen={(objet) => setEtat(examiner(etat, piece.id, objet.id, objet.donne))}
        surMachine={(objet) => { setMachine(objet); setEtat(examiner(etat, piece.id, objet.id)); }}
        surIndice={() => setEtat(deplierIndice(etat, piece.id))}
        surOuverture={() => setEtat(franchir(etat, piece.id))}
      />

      {machine?.exercice && (
        <AtelierC
          exercice={machine.exercice}
          brouillon={etat.brouillons[machine.exercice.id]}
          surBrouillon={(code) => setEtat((avant) =>
            avant && machine.exercice ? noterBrouillon(avant, machine.exercice.id, code) : avant)}
          surReussite={() => setEtat((avant) =>
            avant && machine.exercice
              ? resoudreExercice(examiner(avant, piece.id, machine.id, machine.donne), machine.exercice.id)
              : avant)}
          surFermeture={() => setMachine(null)}
        />
      )}

      {machine?.terminal && (
        <TerminalUnix terminal={machine.terminal} surFermeture={() => setMachine(null)} />
      )}
    </>
  );
}
