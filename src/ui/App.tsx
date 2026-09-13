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
import { DefisCTF } from './DefisCTF';

type Mode = 'selection' | 'escape42' | 'ctf';

export function App() {
  const [mode, setMode] = useState<Mode>('selection');
  const [etat, setEtat] = useState<Etat | null>(null);
  const [sauvee] = useState(() => sauvegarde.lire());
  const [machine, setMachine] = useState<Objet | null>(null);

  // Toute avancée est écrite immédiatement : une partie perdue parce qu'on a fermé
  // l'onglet est une partie que personne ne recommence.
  useEffect(() => { if (etat) sauvegarde.ecrire(etat); }, [etat]);

  const surAube = useCallback(() => {
    setEtat((avant) => (avant ? rattraperParLAube(avant) : avant));
  }, []);

  // Écran de sélection du mode
  if (mode === 'selection') {
    return (
      <div className="titre">
        <div className="titre-contenu" style={{ maxWidth: '600px' }}>
          <p className="sous">Escape 42 — Mode de jeu</p>
          <h1>Choisir une quête</h1>

          <p style={{ margin: '2rem 0', textAlign: 'center', fontSize: '1.1rem' }}>
            Quel défi relèveras-tu?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              className="principal"
              onClick={() => { setMode('escape42'); setEtat(null); }}
              style={{ padding: '1rem', fontSize: '1rem', fontWeight: 'bold' }}
            >
              🏚️ Escape 42 — La Villa Nul
              <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'normal', opacity: 0.8 }}>
                9 pièces · Énigmes + Exercices C · 45 minutes
              </div>
            </button>

            <button
              className="principal"
              onClick={() => { setMode('ctf'); setEtat(null); }}
              style={{ padding: '1rem', fontSize: '1rem', fontWeight: 'bold' }}
            >
              🔍 Défis CTF — Chasse aux secrets
              <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'normal', opacity: 0.8 }}>
                6 défis · Recherche + Logique · Progressif
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mode CTF
  if (mode === 'ctf') {
    return <DefisCTF surTerminaison={() => setMode('selection')} />;
  }

  // Mode Escape 42
  if (!etat) {
    return (
      <EcranTitre
        aUneSauvegarde={sauvee !== null && sauvee.terminee === null}
        surDebut={() => { sauvegarde.effacer(); setEtat(nouvellePartie()); }}
        surReprise={() => { if (sauvee) setEtat(sauvee); }}
        surRetour={() => setMode('selection')}
      />
    );
  }

  if (etat.terminee) {
    return (
      <Fin
        etat={etat}
        surRecommencer={() => { sauvegarde.effacer(); setEtat(null); }}
        surMenu={() => { sauvegarde.effacer(); setMode('selection'); setEtat(null); }}
      />
    );
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
