import { useEffect, useState } from 'react';
import { prechauffer, surProgression, type Progression } from '../c/compilateur';
import { Illustration } from './Illustration';
import { PIECES } from '../contenu';

const PROLOGUE = `La maison est en vente depuis onze ans. L'agence a fini par me donner
les clés sans m'accompagner — « vous verrez, elle se visite très bien toute seule ».

Séverin Nul y a vécu quarante ans et personne ne l'a vu en sortir. Ingénieur, dit le
voisinage. Collectionneur, disent les cartons. Méfiant, dit tout le reste.

À la tombée de la nuit, les volets roulants sont descendus les uns après les autres,
sans que je touche à rien. La porte d'entrée ne s'ouvre plus.

Sur l'écran du hall, une ligne s'est affichée :

  « La maison s'ouvre à qui sait lui parler.
    Tu as jusqu'à l'aube. »`;

export function EcranTitre({ aUneSauvegarde, surDebut, surReprise, surRetour }: {
  aUneSauvegarde: boolean;
  surDebut: () => void;
  surReprise: () => void;
  surRetour?: () => void;
}) {
  const [chaine, setChaine] = useState<Progression | null>({ etape: 'Réveil de la machine', part: 0 });
  const [prete, setPrete] = useState(false);

  // Les 15 Mo du compilateur descendent pendant la lecture du prologue : quand la
  // première machine demandera du C, elle sera déjà prête.
  useEffect(() => {
    const desabonner = surProgression((progression) => {
      setChaine(progression);
      if (progression === null) setPrete(true);
    });
    prechauffer();
    return desabonner;
  }, []);

  const minutes = PIECES.reduce((total, piece) => total + piece.minutes, 0);

  return (
    <div className="titre">
      <div className="titre-contenu">
        <p className="sous">Escape 42</p>
        <h1>La Villa Nul</h1>

        <div style={{ margin: '1.5rem 0' }}>
          <Illustration src="/titre/villa-nuit.webp" alt="La villa, la nuit" />
        </div>

        <p style={{ whiteSpace: 'pre-wrap' }}>{PROLOGUE}</p>

        <p className="cout" style={{ textAlign: 'center' }}>
          Neuf pieces - {minutes} minutes de nuit - du vrai C, compile ici meme
        </p>

        <div className="titre-actions">
          <button className="principal" onClick={surDebut}>
            {aUneSauvegarde ? 'Recommencer depuis le hall' : 'Entrer'}
          </button>
          {aUneSauvegarde && <button onClick={surReprise}>Reprendre ou j en etais</button>}
          {surRetour && <button onClick={surRetour} style={{ marginTop: '0.5rem' }}>Retour aux modes</button>}
        </div>

        <div className="chaine" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
          {prete ? (
            <span>Le compilateur est pret.</span>
          ) : (
            <>
              <span>{chaine?.etape ?? 'Réveil de la machine'}...</span>
              <span className="jauge"><i style={{ width: `${(chaine?.part ?? 0) * 100}%` }} /></span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
