import { useState } from 'react';

/**
 * Les images du jeu sont générées à la main et arrivent au fil de l'eau. Tant qu'un
 * fichier n'est pas là, on montre sa place plutôt qu'une icône cassée : le jeu reste
 * jouable pendant que les décors se remplissent.
 */
export function Illustration({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [absente, setAbsente] = useState(false);

  if (absente) {
    return (
      <div className="fond-absent" role="img" aria-label={alt}>
        {alt}
        <br />
        <span style={{ opacity: 0.5 }}>image à venir</span>
      </div>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setAbsente(true)}
    />
  );
}
