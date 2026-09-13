import { useEffect, useState } from 'react';
import { DEFIS_CTF, hasherReponse } from '../contenu/ctf';
import { Illustration } from './Illustration';

const PROLOGUE_CTF = `Après avoir résolu les énigmes de la Villa, tu découvres une dernière pièce.

Sur un écran, un message clignotant :

  « Les vrais secrets ne sont pas dans les murs.
    Ils sont dispersés partout dans le monde.
    À toi de les trouver. »

Six défis t'attendent. Aucun n'est impossible — ils demandent juste de
l'observation, de la recherche, et une pincée de logique. `;

interface EtatCTF {
  reponses: Map<string, string>;
  termines: Set<string>;
  progression: number;
}

export function DefisCTF({ surTerminaison }: { surTerminaison: () => void }) {
  const [etat, setEtat] = useState<EtatCTF>(() => {
    const sauvee = localStorage.getItem('ctf-etat');
    if (sauvee) {
      const parsed = JSON.parse(sauvee);
      return {
        reponses: new Map(parsed.reponses),
        termines: new Set(parsed.termines),
        progression: parsed.progression,
      };
    }
    return { reponses: new Map(), termines: new Set(), progression: 0 };
  });

  const [defiCourant, setDefiCourant] = useState<string | null>(null);
  const [saisie, setSaisie] = useState('');
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    localStorage.setItem('ctf-etat', JSON.stringify({
      reponses: Array.from(etat.reponses.entries()),
      termines: Array.from(etat.termines),
      progression: etat.progression,
    }));
  }, [etat]);

  const verifierReponse = async () => {
    if (!defiCourant || !saisie.trim()) {
      setMessage('Réponds quelque chose!');
      return;
    }

    setChargement(true);
    try {
      const hash = await hasherReponse(saisie);
      const defi = DEFIS_CTF.find((d) => d.id === defiCourant);

      if (hash === defi?.reponseHash) {
        setMessage('✓ Correct! Excellent travail.');
        setEtat((avant) => ({
          ...avant,
          termines: new Set([...avant.termines, defiCourant]),
          progression: avant.progression + 1,
        }));
        setTimeout(() => {
          setSaisie('');
          setDefiCourant(null);
          setMessage('');
        }, 1000);
      } else {
        setMessage('✗ Pas tout à fait. Essaie encore!');
      }
    } finally {
      setChargement(false);
    }
  };

  if (etat.progression === DEFIS_CTF.length) {
    return (
      <div className="titre">
        <div className="titre-contenu">
          <p className="sous">Défis CTF — Victoire</p>
          <h1>La Villa Révélée</h1>

          <div style={{ margin: '1.5rem 0', maxWidth: '100%', aspectRatio: '16/9' }}>
            <Illustration src="/pieces/51-evasion.webp" alt="L'évasion finale" />
          </div>

          <p style={{ whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
            {`Tu as retrouvé tous les secrets. Dans la cave, sous les derniers cartons,
tu découvres un journal. Séverin y raconte sa vie : un ingénieur passionné
qui a transformé sa maison en laboratoire de pensée.

Chaque pièce était une leçon. Chaque énigme, une étape vers la maîtrise du code.

Et toi, tu as appris comme il enseignait — en cherchant, en comprenant, en
transformant les obstacles en découvertes.

La Villa Nul n'était jamais une prison. C'était une école.`}
          </p>

          <div className="titre-actions">
            <button className="principal" onClick={surTerminaison}>
              Recommencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!defiCourant) {
    return (
      <div className="titre">
        <div className="titre-contenu">
          <p className="sous">Défis CTF</p>
          <h1>Chasse aux secrets</h1>

          <div style={{ margin: '1.5rem 0', maxWidth: '100%', aspectRatio: '16/9' }}>
            <Illustration src="/pieces/01-villa-nuit.webp" alt="La villa, la nuit" />
          </div>

          <p style={{ whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>{PROLOGUE_CTF}</p>

          <div className="cout" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Progression: {etat.progression} / {DEFIS_CTF.length} défis résolus
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {DEFIS_CTF.map((defi) => (
              <button
                key={defi.id}
                onClick={() => setDefiCourant(defi.id)}
                disabled={etat.termines.has(defi.id)}
                style={{
                  padding: '1rem',
                  border: '2px solid #666',
                  background: etat.termines.has(defi.id) ? '#2a5a2a' : '#1a1a2e',
                  color: etat.termines.has(defi.id) ? '#90ee90' : '#ddd',
                  borderRadius: '4px',
                  cursor: etat.termines.has(defi.id) ? 'default' : 'pointer',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                <div>{`${etat.termines.has(defi.id) ? '✓' : '○'} Défi ${defi.numero}`}</div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', opacity: 0.8 }}>
                  {defi.titre}
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', opacity: 0.6 }}>
                  {defi.difficulte === 'facile' ? '⭐' : defi.difficulte === 'moyen' ? '⭐⭐' : '⭐⭐⭐'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const defi = DEFIS_CTF.find((d) => d.id === defiCourant);
  if (!defi) return null;

  return (
    <div className="titre">
      <div className="titre-contenu">
        <p className="sous">Défi {defi.numero} / {DEFIS_CTF.length}</p>
        <h1>{defi.titre}</h1>

        <div style={{ background: '#1a1a2e', padding: '1.5rem', borderRadius: '4px', margin: '1.5rem 0' }}>
          <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{defi.description}</p>

          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', color: '#888' }}>💡 Indice</summary>
            <p style={{ marginTop: '0.5rem', color: '#aaa' }}>{defi.indice}</p>
          </details>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <textarea
            value={saisie}
            onChange={(e) => {
              setSaisie(e.target.value);
              setMessage('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) verifierReponse();
            }}
            placeholder="Ta réponse ici..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '0.8rem',
              background: '#2a2a3e',
              color: '#ddd',
              border: '1px solid #666',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
          />
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: message.startsWith('✓') ? '#2a5a2a' : '#5a2a2a',
            color: message.startsWith('✓') ? '#90ee90' : '#ff6666',
            borderRadius: '4px',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="principal"
            onClick={verifierReponse}
            disabled={chargement}
            style={{ flex: 1 }}
          >
            {chargement ? 'Vérification...' : 'Vérifier'}
          </button>
          <button
            onClick={() => {
              setDefiCourant(null);
              setSaisie('');
              setMessage('');
            }}
            style={{ flex: 1 }}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
