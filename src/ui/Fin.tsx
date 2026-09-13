import { enPendule } from '../moteur/horloge';
import { creditMs, restantMs, type Etat } from '../moteur/partie';
import { Illustration } from './Illustration';
import { PIECES } from '../contenu';

const EVASION = `La porte d'entrée est ouverte. Le jour se lève sur un jardin en friche,
et l'air du dehors sent la terre mouillée.

Dans ma poche, le cachet de cire s'est brisé. L'enveloppe ne contient pas un testament :
une feuille de papier quadrillé, et dessus, de sa main :

  « Si tu lis ça, tu as appris à parler à une machine.
    C'est tout ce que j'avais à laisser. »`;

const AUBE = `Le jour s'est levé sans moi.

Les volets ne se sont pas relevés. L'écran du hall s'est éteint. La maison a cessé de
poser des questions — c'est la pire réponse qu'elle pouvait me faire.`;

export function Fin({ etat, surRecommencer, surMenu }: { etat: Etat; surRecommencer: () => void; surMenu?: () => void }) {
  const evasion = etat.terminee === 'evasion';
  const duree = (etat.termineeA ?? Date.now()) - etat.commenceeA;
  const indices = Object.values(etat.indicesOuverts).reduce((total, n) => total + n, 0);

  return (
    <div className="fin">
      <div>
        <h1>{evasion ? 'Dehors' : 'L’aube'}</h1>

        <div style={{ maxWidth: '38rem', margin: '0 auto 2rem' }}>
          <Illustration
            src={evasion ? '/fins/evasion.webp' : '/fins/echec.webp'}
            alt={evasion ? 'La porte ouverte au petit matin' : 'Le hall au matin, porte close'}
          />
        </div>

        <div className="recit" style={{ whiteSpace: 'pre-wrap' }}>{evasion ? EVASION : AUBE}</div>

        <div className="bilan">
          <div>
            <span className="valeur">{etat.piecesResolues.length}/{PIECES.length}</span>
            <span className="quoi">pièces franchies</span>
          </div>
          <div>
            <span className="valeur">{enPendule(duree)}</span>
            <span className="quoi">passées dedans</span>
          </div>
          <div>
            <span className="valeur">{enPendule(restantMs(etat))}</span>
            <span className="quoi">de nuit restante</span>
          </div>
          <div>
            <span className="valeur">{indices}</span>
            <span className="quoi">indices dépliés</span>
          </div>
        </div>

        <p className="cout">
          Nuit dotée de {enPendule(creditMs(etat))}, dont {enPendule(etat.penaliteMs)} dépensées en réflexion.
        </p>

        <button className="principal" onClick={surRecommencer}>Revenir devant la maison</button>
        {surMenu && <button onClick={surMenu} style={{ marginTop: '0.5rem' }}>Retour aux modes</button>}
      </div>
    </div>
  );
}
