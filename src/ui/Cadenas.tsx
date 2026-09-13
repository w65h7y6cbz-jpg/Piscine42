import { useState } from 'react';
import { verifier } from '../moteur/verrous';
import type { Verrou } from '../contenu/types';

export function Cadenas({ verrou, inventaire, surOuverture }: {
  verrou: Verrou;
  inventaire: string[];
  surOuverture: () => void;
}) {
  const [saisie, setSaisie] = useState('');
  const [refus, setRefus] = useState<string | null>(null);

  if (verrou.type === 'objet') {
    const possede = inventaire.includes(verrou.objet);
    return (
      <div className="encart">
        <h2>{verrou.intitule}</h2>
        {possede
          ? <button className="principal" onClick={surOuverture}>Ouvrir</button>
          : <p className="vide">Fermée. Il me manque de quoi l’ouvrir.</p>}
      </div>
    );
  }

  // Le rétrécissement de type ne franchit pas la frontière d'une closure quand il
  // porte sur un paramètre : on le fige dans une constante.
  const aCode = verrou;
  const chiffres = aCode.type === 'code';

  async function essayer(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (await verifier(saisie, aCode.empreinte)) {
      setRefus(null);
      surOuverture();
    } else {
      setRefus(chiffres ? 'Le cadran refuse et se remet à zéro.' : 'Les barillets ne s’alignent pas.');
      setSaisie('');
    }
  }

  return (
    <div className="encart">
      <h2>{aCode.intitule}</h2>
      <form className="cadenas" onSubmit={essayer}>
        <input
          value={saisie}
          onChange={(e) => {
            const propre = chiffres
              ? e.target.value.replace(/\D/g, '')
              : e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
            setSaisie(propre.slice(0, aCode.longueur));
            setRefus(null);
          }}
          inputMode={chiffres ? 'numeric' : 'text'}
          aria-label={aCode.intitule}
          placeholder={'·'.repeat(aCode.longueur)}
        />
        <button className="principal" disabled={saisie.length !== aCode.longueur}>
          Essayer
        </button>
      </form>
      {refus && <p className="refus">{refus}</p>}
    </div>
  );
}
