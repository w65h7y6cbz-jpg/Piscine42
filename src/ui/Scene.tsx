import { useState } from 'react';
import type { Objet, Piece } from '../contenu/types';
import { INVENTAIRE } from '../contenu';
import { aExamine, aResolu, COUT_INDICE_MINUTES, type Etat } from '../moteur/partie';
import { Illustration } from './Illustration';
import { Recit } from './texte';
import { Cadenas } from './Cadenas';

export function Scene({ piece, etat, surExamen, surMachine, surIndice, surOuverture }: {
  piece: Piece;
  etat: Etat;
  surExamen: (objet: Objet) => void;
  surMachine: (objet: Objet) => void;
  surIndice: () => void;
  surOuverture: () => void;
}) {
  const [regarde, setRegarde] = useState<Objet | null>(null);

  const visible = (objet: Objet) => !objet.apparaitApres || aResolu(etat, objet.apparaitApres);
  const bloque = (objet: Objet) => objet.requiert !== undefined && !etat.inventaire.includes(objet.requiert);

  function cliquer(objet: Objet) {
    setRegarde(objet);
    if (bloque(objet)) return;
    if (objet.exercice || objet.terminal) {
      surMachine(objet);
      return;
    }
    surExamen(objet);
  }

  const indicesOuverts = etat.indicesOuverts[piece.id] ?? 0;
  const resolue = etat.piecesResolues.includes(piece.id);

  return (
    <div className="jeu">
      <div className="decor">
        <Illustration className="fond" src={piece.fond} alt={piece.nom} />
        {piece.objets.filter(visible).map((objet) => (
          <button
            key={objet.id}
            className={`zone${aExamine(etat, piece.id, objet.id) ? ' vue' : ''}`}
            style={{
              left: `${objet.zone.x}%`, top: `${objet.zone.y}%`,
              width: `${objet.zone.l}%`, height: `${objet.zone.h}%`,
            }}
            onClick={() => cliquer(objet)}
            aria-label={objet.nom}
          >
            <span className="etiquette">{objet.nom}</span>
          </button>
        ))}
      </div>

      <div className="colonnes">
        <div>
          <div className="encart">
            <h2>{regarde ? regarde.nom : piece.nom}</h2>
            {regarde
              ? <Recit texte={bloque(regarde) ? (regarde.refus ?? 'Fermé.') : regarde.examen} />
              : <Recit texte={piece.arrivee} />}
          </div>

          {resolue && (
            <div className="encart" style={{ marginTop: '1rem' }}>
              <h2>Le passage</h2>
              <Recit texte={piece.sortie} />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
          {!resolue && (
            <Cadenas verrou={piece.verrou} inventaire={etat.inventaire} surOuverture={surOuverture} />
          )}

          <div className="encart">
            <h2>Inventaire</h2>
            {etat.inventaire.length === 0
              ? <p className="vide">Les poches vides.</p>
              : (
                <div className="inventaire">
                  {etat.inventaire.map((id) => (
                    <span key={id} className="objet" title={INVENTAIRE[id]?.description}>
                      {INVENTAIRE[id]?.nom ?? id}
                    </span>
                  ))}
                </div>
              )}
          </div>

          <div className="encart">
            <h2>Se souvenir</h2>
            {piece.indices.slice(0, indicesOuverts).map((indice, index) => (
              <p key={index} className="indice">{indice}</p>
            ))}
            {indicesOuverts < piece.indices.length ? (
              <>
                <button onClick={surIndice}>
                  {indicesOuverts === 0 ? 'Réfléchir un instant' : 'Réfléchir encore'}
                </button>
                <p className="cout">{COUT_INDICE_MINUTES} minutes de nuit en moins.</p>
              </>
            ) : (
              <p className="cout">Je n’ai plus rien à me dire sur cette pièce.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
