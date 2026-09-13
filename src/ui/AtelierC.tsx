import { useEffect, useRef, useState } from 'react';
import { compilerEtExecuter, type Resultat } from '../c/compilateur';
import { verifierNorme, type Ecart } from '../moteur/norme';
import type { Exercice } from '../contenu/types';
import { Recit } from './texte';

type Verdict =
  | { sorte: 'repos' }
  | { sorte: 'travaille' }
  | { sorte: 'rendu'; resultat: Resultat; ecarts: Ecart[]; juste: boolean };

export function AtelierC({ exercice, brouillon, surBrouillon, surReussite, surFermeture }: {
  exercice: Exercice;
  brouillon: string | undefined;
  surBrouillon: (code: string) => void;
  surReussite: () => void;
  surFermeture: () => void;
}) {
  const [code, setCode] = useState(brouillon ?? exercice.squelette);
  const [verdict, setVerdict] = useState<Verdict>({ sorte: 'repos' });
  const zone = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { zone.current?.focus(); }, []);

  async function lancer() {
    setVerdict({ sorte: 'travaille' });
    surBrouillon(code);

    // Le harnais est recollé derrière le code du joueur : il appelle la fonction
    // qu'on lui demande d'écrire, comme le ferait un correcteur de piscine.
    const source = exercice.harnais ? `${code}\n\n${exercice.harnais}\n` : code;
    const resultat = await compilerEtExecuter(source);

    const ecarts = exercice.norme ? verifierNorme(code) : [];
    const sortieAttendue = resultat.sortie.trim() === exercice.attendu.trim();
    const juste = resultat.reussi && sortieAttendue && ecarts.length === 0;

    setVerdict({ sorte: 'rendu', resultat, ecarts, juste });
    if (juste) surReussite();
  }

  /** Une tabulation dans un textarea change de champ par défaut. Pas ici : c'est du C. */
  function touche(evenement: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (evenement.key !== 'Tab') return;
    evenement.preventDefault();
    const champ = evenement.currentTarget;
    const { selectionStart: debut, selectionEnd: fin } = champ;
    const suivant = `${code.slice(0, debut)}\t${code.slice(fin)}`;
    setCode(suivant);
    requestAnimationFrame(() => champ.setSelectionRange(debut + 1, debut + 1));
  }

  return (
    <div className="voile" role="dialog" aria-label={`Machine — ${exercice.notion}`}>
      <div className="atelier">
        <header>
          <h2>La machine</h2>
          <span className="notion">{exercice.notion}</span>
          <button className="fermer" onClick={surFermeture}>Reculer</button>
        </header>

        <div className="corps">
          <div className="consigne">
            <p className="invite">{exercice.invite}</p>
            <Recit texte={exercice.consigne} />
          </div>

          <div className="editeur">
            <textarea
              ref={zone}
              value={code}
              spellCheck={false}
              onChange={(e) => setCode(e.target.value)}
              onBlur={() => surBrouillon(code)}
              onKeyDown={touche}
              aria-label="Ton code C"
            />
            <div className="barre">
              <button
                className="principal"
                onClick={lancer}
                disabled={verdict.sorte === 'travaille'}
              >
                {verdict.sorte === 'travaille' ? 'Compilation…' : 'Compiler et exécuter'}
              </button>
              <button onClick={() => setCode(exercice.squelette)}>Repartir du début</button>
              {verdict.sorte === 'rendu' && (
                <span className="etat">
                  {verdict.resultat.duree.compilation} ms de compilation,
                  {' '}{verdict.resultat.duree.execution} ms d’exécution
                </span>
              )}
            </div>
          </div>
        </div>

        {verdict.sorte === 'rendu' && (
          <Rapport verdict={verdict} attendu={exercice.attendu} />
        )}
      </div>
    </div>
  );
}

function Rapport({ verdict, attendu }: { verdict: Extract<Verdict, { sorte: 'rendu' }>; attendu: string }) {
  const { resultat, ecarts, juste } = verdict;

  if (juste) {
    return (
      <div className="console">
        <span className="ok">{resultat.sortie}</span>
        {'\n\n'}
        <span className="ok">La machine accepte. Quelque chose s’est débloqué dans la pièce.</span>
      </div>
    );
  }

  return (
    <div className="console">
      {resultat.diagnostics && (
        <><span className="erreur">{resultat.diagnostics}</span>{'\n\n'}</>
      )}

      {resultat.reussi && (
        <>
          {`sortie du programme : ${JSON.stringify(resultat.sortie)}\n`}
          {`la machine attendait : ${JSON.stringify(attendu)}\n\n`}
        </>
      )}

      {!resultat.reussi && resultat.code !== null && !resultat.diagnostics && (
        <><span className="erreur">
          {`Le programme s’est arrêté avec le code ${resultat.code}. `}
          {resultat.code === 134 || resultat.code === 139
            ? 'Une lecture hors des clous, ou une récursion sans fond.'
            : 'Regarde ce qu’il renvoie.'}
        </span>{'\n\n'}</>
      )}

      {ecarts.length > 0 && (
        <>
          <span className="erreur">{`La Norme refuse ${ecarts.length} chose${ecarts.length > 1 ? 's' : ''} :`}</span>
          {'\n'}
          {ecarts.map((ecart) => `  ligne ${ecart.ligne} — ${ecart.regle} : ${ecart.message}\n`)}
        </>
      )}
    </div>
  );
}
