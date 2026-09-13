import { useEffect, useRef, useState } from 'react';
import type { Terminal } from '../contenu/types';

/**
 * Un Unix de poche : de quoi se promener, lire, chercher et changer des droits.
 * Pas un émulateur — juste assez pour que les commandes de la piscine aient un sens
 * et produisent de vraies réponses, y compris les refus.
 */
export function TerminalUnix({ terminal, surFermeture }: { terminal: Terminal; surFermeture: () => void }) {
  const [lignes, setLignes] = useState<string[]>([terminal.accueil, '']);
  const [saisie, setSaisie] = useState('');
  const [dossier, setDossier] = useState('/home/severin');
  const [ouverts, setOuverts] = useState<string[]>([]);
  const bas = useRef<HTMLDivElement>(null);
  const champ = useRef<HTMLInputElement>(null);

  useEffect(() => { champ.current?.focus(); }, []);
  useEffect(() => { bas.current?.scrollTo(0, bas.current.scrollHeight); }, [lignes]);

  const existe = (chemin: string) => chemin in terminal.fichiers;
  const estDossier = (chemin: string) => terminal.fichiers[chemin] === null;

  /** Résout `~`, `..`, `.` et les chemins relatifs, comme le ferait un vrai shell. */
  function resoudre(brut: string): string {
    let chemin = brut.startsWith('~') ? brut.replace('~', '/home/severin') : brut;
    if (!chemin.startsWith('/')) chemin = `${dossier}/${chemin}`;
    const pile: string[] = [];
    for (const morceau of chemin.split('/')) {
      if (morceau === '' || morceau === '.') continue;
      if (morceau === '..') pile.pop();
      else pile.push(morceau);
    }
    return `/${pile.join('/')}`;
  }

  function enfants(chemin: string): string[] {
    const prefixe = chemin === '/' ? '/' : `${chemin}/`;
    return Object.keys(terminal.fichiers)
      .filter((f) => f.startsWith(prefixe) && f !== chemin)
      .map((f) => f.slice(prefixe.length))
      .filter((reste) => reste !== '' && !reste.includes('/'))
      .sort();
  }

  function executer(commande: string): string[] {
    const mots = commande.trim().split(/\s+/).filter(Boolean);
    if (mots.length === 0) return [];
    const [outil, ...reste] = mots as [string, ...string[]];
    const options = reste.filter((m) => m.startsWith('-'));
    const arguments_ = reste.filter((m) => !m.startsWith('-'));
    const cible = arguments_[0] ? resoudre(arguments_[0]) : dossier;

    switch (outil) {
      case 'help':
        return ['Commandes : pwd, ls [-a], cd, cat, chmod, find, grep, git log, clear, exit'];

      case 'pwd':
        return [dossier];

      case 'ls': {
        if (!existe(cible)) return [`ls: ${arguments_[0]}: aucun fichier de ce nom`];
        if (!estDossier(cible)) return [arguments_[0] ?? cible];
        const tout = options.some((o) => o.includes('a'));
        const liste = enfants(cible).filter((nom) => tout || !nom.startsWith('.'));
        return liste.length ? [liste.join('   ')] : ['(vide)'];
      }

      case 'cd': {
        if (!arguments_[0]) { setDossier('/home/severin'); return []; }
        if (!existe(cible)) return [`cd: ${arguments_[0]}: aucun dossier de ce nom`];
        if (!estDossier(cible)) return [`cd: ${arguments_[0]}: ce n'est pas un dossier`];
        setDossier(cible);
        return [];
      }

      case 'cat': {
        if (!arguments_[0]) return ['cat: il me faut un fichier'];
        if (!existe(cible)) return [`cat: ${arguments_[0]}: aucun fichier de ce nom`];
        if (estDossier(cible)) return [`cat: ${arguments_[0]}: c'est un dossier`];
        if (terminal.interdits.includes(cible) && !ouverts.includes(cible)) {
          return [`cat: ${arguments_[0]}: permission refusée`];
        }
        return (terminal.fichiers[cible] ?? '').split('\n');
      }

      case 'chmod': {
        const fichier = arguments_.find((m) => m !== arguments_[0] || arguments_.length === 1);
        const chemin = resoudre(arguments_[arguments_.length - 1] ?? '');
        const mode = arguments_[0] ?? options[0] ?? '';
        void fichier;
        if (!existe(chemin)) return [`chmod: ${arguments_[arguments_.length - 1]}: aucun fichier de ce nom`];
        if (!/\+r|[4-7]\d\d|\+.*r/.test(mode) && !options.some((o) => o.includes('r'))) {
          return [`chmod: ${mode || '(rien)'} : ce mode ne rend rien lisible.`];
        }
        setOuverts((liste) => [...new Set([...liste, chemin])]);
        return [];
      }

      case 'find': {
        const motif = arguments_[1] ?? arguments_[0] ?? '';
        const racine = arguments_.length > 1 ? resoudre(arguments_[0]!) : '/';
        const trouves = Object.keys(terminal.fichiers)
          .filter((f) => f.startsWith(racine) && f.includes(motif.replace(/\*/g, '')))
          .sort();
        return trouves.length ? trouves : ['find: rien de tel'];
      }

      case 'grep': {
        const motif = arguments_[0] ?? '';
        const trouves: string[] = [];
        for (const [chemin, contenu] of Object.entries(terminal.fichiers)) {
          if (contenu === null) continue;
          if (terminal.interdits.includes(chemin) && !ouverts.includes(chemin)) continue;
          for (const ligne of contenu.split('\n')) {
            if (ligne.toLowerCase().includes(motif.toLowerCase())) trouves.push(`${chemin}: ${ligne}`);
          }
        }
        return trouves.length ? trouves : [`grep: aucune ligne avec « ${motif} »`];
      }

      case 'git': {
        if (arguments_[0] !== 'log') return ['git: seul « git log » est disponible ici.'];
        if (!dossier.startsWith('/home/severin/notes')) {
          return ['fatal: ce dossier n’est pas un dépôt git'];
        }
        return terminal.journalGit.flatMap((commit) => [
          `commit ${commit.empreinte}`,
          `    ${commit.message}`,
          '',
        ]);
      }

      case 'clear':
        setLignes([]);
        return [];

      case 'exit':
        surFermeture();
        return [];

      default:
        return [`${outil}: commande inconnue. « help » donne la liste.`];
    }
  }

  function valider(evenement: React.FormEvent) {
    evenement.preventDefault();
    const commande = saisie;
    setSaisie('');
    setLignes((avant) => [...avant, `${dossier} $ ${commande}`, ...executer(commande), '']);
  }

  return (
    <div className="voile" role="dialog" aria-label="Terminal">
      <div className="atelier">
        <header>
          <h2>Terminal</h2>
          <span className="notion">Unix — fichiers, droits, git</span>
          <button className="fermer" onClick={surFermeture}>Reculer</button>
        </header>
        <div className="terminal" ref={bas}>{lignes.join('\n')}</div>
        <form className="terminal-saisie" onSubmit={valider}>
          <span>{dossier} $</span>
          <input
            ref={champ}
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-label="Commande"
          />
        </form>
      </div>
    </div>
  );
}
