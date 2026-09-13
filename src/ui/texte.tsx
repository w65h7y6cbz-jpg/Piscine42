import { Fragment, type ReactNode } from 'react';

/**
 * Un rendu minuscule du peu de balisage qu'utilisent les textes du jeu :
 * **gras**, `code`, et les blocs ```c ... ```. Pas de bibliothèque pour ça —
 * le contenu est écrit par nous, il n'y a rien à assainir.
 */
export function Recit({ texte, className }: { texte: string; className?: string }) {
  const blocs = texte.split(/```[a-z]*\n?/);
  return (
    <div className={className ?? 'recit'}>
      {blocs.map((bloc, index) =>
        index % 2 === 1
          ? <pre key={index}>{bloc.replace(/\n$/, '')}</pre>
          : <Fragment key={index}>{enLignes(bloc)}</Fragment>,
      )}
    </div>
  );
}

function enLignes(texte: string): ReactNode {
  return texte.split('\n').map((ligne, index, toutes) => (
    <Fragment key={index}>
      {enStyles(ligne)}
      {index < toutes.length - 1 ? '\n' : null}
    </Fragment>
  ));
}

function enStyles(ligne: string): ReactNode[] {
  const morceaux: ReactNode[] = [];
  const motif = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let dernier = 0;
  let trouve: RegExpExecArray | null;

  while ((trouve = motif.exec(ligne)) !== null) {
    if (trouve.index > dernier) morceaux.push(ligne.slice(dernier, trouve.index));
    if (trouve[1] !== undefined) {
      morceaux.push(<strong key={trouve.index}>{trouve[1]}</strong>);
    } else {
      morceaux.push(<code key={trouve.index}>{trouve[2]}</code>);
    }
    dernier = trouve.index + trouve[0].length;
  }
  if (dernier < ligne.length) morceaux.push(ligne.slice(dernier));
  return morceaux;
}
